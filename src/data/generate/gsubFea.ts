export interface FeaParseResult {
	globalClasses: GlyphClassDefinition[];
	features: FeatureBlock[];
}

export type FeaStatement = GlyphClassDefinition | SubstituteStatement;

export interface FeatureBlock {
	tag: string;
	useExtension: boolean;
	statements: FeaStatement[];
}

export interface GlyphClassDefinition {
	type: "glyphClass";
	name: string;
	members: GlyphExpression[];
}

export type GlyphExpression = GlyphLiteral | GlyphClassReference | GlyphGroup;

interface GlyphExpressionBase {
	mark?: boolean;
}

export interface GlyphLiteral extends GlyphExpressionBase {
	kind: "glyph";
	value: string;
}

export interface GlyphClassReference extends GlyphExpressionBase {
	kind: "class";
	name: string;
}

export interface GlyphGroup extends GlyphExpressionBase {
	kind: "group";
	items: GlyphExpression[];
}

export type SubstituteStatement = SubstituteByStatement | SubstituteFromStatement;

interface SubstituteStatementBase {
	type: "substitute";
	inputs: GlyphExpression[];
}

export interface SubstituteByStatement extends SubstituteStatementBase {
	mode: "by";
	replacements: GlyphExpression[];
}

export interface SubstituteFromStatement extends SubstituteStatementBase {
	mode: "from";
	alternates: GlyphExpression[];
}

type TokenType = "identifier" | "glyph" | "class" | "symbol";

interface Token {
	type: TokenType;
	value: string;
	index: number;
}

export function parseGsubFea(feaText: string): FeaParseResult {
    // Workaround: ignore lookups.
    feaText = feaText.replace(/\s+lookup [^{;]+\{[^}]+\} [^;]+;/mg, "");

	const tokenizer = new Tokenizer(feaText);
	const tokens = tokenizer.tokenize();
	const parser = new Parser(tokens);
	return parser.parse();
}

class Tokenizer {
	private readonly text: string;
	private index = 0;

	constructor(text: string) {
		this.text = text;
	}

	tokenize(): Token[] {
		const tokens: Token[] = [];
		while (!this.isAtEnd()) {
			const char = this.peek();
			if (isWhitespace(char)) {
				this.advance();
				continue;
			}
			if (char === "#") {
				this.skipUntilNewline();
				continue;
			}
			if (char === "/" && this.peek(1) === "/") {
				this.advance(2);
				this.skipUntilNewline();
				continue;
			}
			if (char === "/" && this.peek(1) === "*") {
				this.advance(2);
				this.skipBlockComment();
				continue;
			}
			if (SYMBOLS.has(char)) {
				tokens.push({ type: "symbol", value: char, index: this.index });
				this.advance();
				continue;
			}
			if (char === "@") {
				tokens.push(this.readClass());
				continue;
			}
			if (char === "\\") {
				tokens.push(this.readGlyph());
				continue;
			}
			if (isNameChar(char)) {
				tokens.push(this.readIdentifier());
				continue;
			}
			// Unknown character, skip to avoid infinite loop.
			this.advance();
		}
		return tokens;
	}

	private readIdentifier(): Token {
		const start = this.index;
		let value = "";
		while (!this.isAtEnd() && isNameChar(this.peek())) {
			value += this.peek();
			this.advance();
		}
		return { type: "identifier", value, index: start };
	}

	private readGlyph(): Token {
		const start = this.index;
		let value = "";
		value += this.peek();
		this.advance();
		while (!this.isAtEnd() && isGlyphChar(this.peek())) {
			value += this.peek();
			this.advance();
		}
		return { type: "glyph", value, index: start };
	}

	private readClass(): Token {
		const start = this.index;
		let value = "";
		value += this.peek();
		this.advance();
		while (!this.isAtEnd() && isNameChar(this.peek())) {
			value += this.peek();
			this.advance();
		}
		return { type: "class", value, index: start };
	}

	private skipUntilNewline() {
		while (!this.isAtEnd()) {
			const char = this.peek();
			this.advance();
			if (char === "\n") {
				break;
			}
		}
	}

	private skipBlockComment() {
		while (!this.isAtEnd()) {
			if (this.peek() === "*" && this.peek(1) === "/") {
				this.advance(2);
				break;
			}
			this.advance();
		}
	}

	private peek(offset = 0): string {
		return this.text[this.index + offset] ?? "";
	}

	private advance(count = 1) {
		this.index += count;
	}

	private isAtEnd() {
		return this.index >= this.text.length;
	}
}

class Parser {
	private readonly tokens: Token[];
	private index = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): FeaParseResult {
		const globalClasses: GlyphClassDefinition[] = [];
		const features: FeatureBlock[] = [];
		while (!this.isAtEnd()) {
			if (this.matchIdentifier("feature")) {
				const feature = this.parseFeature();
				if (feature) {
					features.push(feature);
				}
				continue;
			}
			if (this.peekIsClassDefinition()) {
				const glyphClass = this.parseGlyphClassDefinition();
				if (glyphClass) {
					globalClasses.push(glyphClass);
				}
				continue;
			}
			this.skipUntilSemicolon();
		}
		return { globalClasses, features };
	}

	private parseFeature(): FeatureBlock | null {
		const tagToken = this.consumeIdentifier();
		if (!tagToken) {
			return null;
		}
		let useExtension = false;
		if (this.matchIdentifier("useExtension")) {
			useExtension = true;
		}
		if (!this.matchSymbol("{")) {
			return null;
		}
		const statements: FeaStatement[] = [];
		while (!this.isAtEnd() && !this.checkSymbol("}")) {
			if (this.matchIdentifier("substitute")) {
				const substitution = this.parseSubstituteStatement();
				if (substitution) {
					statements.push(substitution);
				}
				continue;
			}
			if (this.matchIdentifier("sub")) {
				const substitution = this.parseSubstituteStatement();
				if (substitution) {
					statements.push(substitution);
				}
				continue;
			}
			if (this.peekIsClassDefinition()) {
				const glyphClass = this.parseGlyphClassDefinition();
				if (glyphClass) {
					statements.push(glyphClass);
				}
				continue;
			}
			this.skipUntilSemicolon();
		}
		if (!this.matchSymbol("}")) {
			return null;
		}
		const endTag = this.consumeIdentifier();
		if (endTag && endTag.value !== tagToken.value) {
			// Tags should match; ignore mismatch but continue.
		}
		this.matchSymbol(";");
		return { tag: tagToken.value, useExtension, statements };
	}

	private parseSubstituteStatement(): SubstituteStatement | null {
		const inputs = this.parseGlyphSequence(["by", "from", "lookup"]);
		if (!inputs.length) {
			this.skipUntilSemicolon();
			return null;
		}
		if (this.matchIdentifier("by")) {
			const replacements = this.parseGlyphSequence([";"], true);
			this.matchSymbol(";");
			return {
				type: "substitute",
				mode: "by",
				inputs,
				replacements,
			} satisfies SubstituteByStatement;
		}
		if (this.matchIdentifier("from")) {
			const alternatesExpr = this.parseGlyphExpression();
			const alternates = alternatesExpr?.kind === "group"
				? alternatesExpr.items
				: alternatesExpr
					? [alternatesExpr]
					: [];
			this.matchSymbol(";");
			return {
				type: "substitute",
				mode: "from",
				inputs,
				alternates,
			} satisfies SubstituteFromStatement;
		}
		// Unsupported form, skip the remainder of the statement.
		this.skipUntilSemicolon();
		return null;
	}

	private parseGlyphClassDefinition(): GlyphClassDefinition | null {
		const classToken = this.consumeToken("class");
		if (!classToken) {
			return null;
		}
		if (!this.matchSymbol("=")) {
			this.skipUntilSemicolon();
			return null;
		}
		const valueExpr = this.parseGlyphExpression();
		const members = valueExpr
			? valueExpr.kind === "group"
				? valueExpr.items
				: [valueExpr]
			: [];
		this.matchSymbol(";");
		return {
			type: "glyphClass",
			name: classToken.value.replace(/^@/, ""),
			members,
		};
	}

	private parseGlyphSequence(stopWords: string[], stopOnSymbol = false): GlyphExpression[] {
		const expressions: GlyphExpression[] = [];
		while (!this.isAtEnd()) {
			const token = this.peek();
			if (!token) {
				break;
			}
			if (token.type === "symbol") {
				if (token.value === ";" || token.value === "}" || (stopOnSymbol && stopWords.includes(token.value))) {
					break;
				}
			}
			if (token.type === "identifier" && stopWords.includes(token.value)) {
				break;
			}
			const expr = this.parseGlyphExpression();
			if (!expr) {
				break;
			}
			expressions.push(expr);
		}
		return expressions;
	}

	private parseGlyphExpression(allowGroup = true): GlyphExpression | null {
		const token = this.peek();
		if (!token) {
			return null;
		}
		if (token.type === "symbol" && token.value === "[" && allowGroup) {
			this.advance();
			const items: GlyphExpression[] = [];
			while (!this.isAtEnd() && !this.checkSymbol("]")) {
				const expr = this.parseGlyphExpression();
				if (expr) {
					items.push(expr);
				} else {
					this.advance();
				}
			}
			this.matchSymbol("]");
			const group: GlyphGroup = { kind: "group", items };
			this.applyMark(group);
			return group;
		}
		if (token.type === "class") {
			this.advance();
			const classExpr: GlyphClassReference = {
				kind: "class",
				name: token.value.replace(/^@/, ""),
			};
			this.applyMark(classExpr);
			return classExpr;
		}
		if (token.type === "glyph" || token.type === "identifier") {
			this.advance();
			const literal: GlyphLiteral = { kind: "glyph", value: token.value };
			this.applyMark(literal);
			return literal;
		}
		return null;
	}

	private applyMark(expr: GlyphExpression) {
		if (this.checkSymbol("'")) {
			this.advance();
			expr.mark = true;
		}
	}

	private peekIsClassDefinition(): boolean {
		const current = this.peek();
		const next = this.peek(1);
		return !!(current && next && current.type === "class" && next.type === "symbol" && next.value === "=");
	}

	private skipUntilSemicolon() {
		while (!this.isAtEnd()) {
			const token = this.advance();
			if (token?.type === "symbol" && token.value === ";") {
				break;
			}
			if (token?.type === "symbol" && token.value === "}") {
				// Step back so enclosing parser can handle the closing brace.
				this.index = Math.max(0, this.index - 1);
				break;
			}
		}
	}

	private matchIdentifier(value: string): boolean {
		const token = this.peek();
		if (token?.type === "identifier" && token.value === value) {
			this.advance();
			return true;
		}
		return false;
	}

	private consumeIdentifier(): Token | null {
		const token = this.peek();
		if (token?.type === "identifier") {
			this.advance();
			return token;
		}
		return null;
	}

	private matchSymbol(value: string): boolean {
		const token = this.peek();
		if (token?.type === "symbol" && token.value === value) {
			this.advance();
			return true;
		}
		return false;
	}

	private checkSymbol(value: string): boolean {
		const token = this.peek();
		return !!(token?.type === "symbol" && token.value === value);
	}

	private consumeToken(type: TokenType): Token | null {
		const token = this.peek();
		if (token?.type === type) {
			this.advance();
			return token;
		}
		return null;
	}

	private peek(offset = 0): Token | undefined {
		return this.tokens[this.index + offset];
	}

	private advance(): Token | undefined {
		if (!this.isAtEnd()) {
			return this.tokens[this.index++];
		}
		return undefined;
	}

	private isAtEnd() {
		return this.index >= this.tokens.length;
	}
}

const SYMBOLS = new Set(["{", "}", "[", "]", ";", "=", "'", "(", ")", ","]);

const isWhitespace = (char: string): boolean => /\s/.test(char);

const isNameChar = (char: string): boolean => /[A-Za-z0-9_.-]/.test(char);

const isGlyphChar = (char: string): boolean => /[A-Za-z0-9_.-]/.test(char);
