import fs from "fs/promises";
import path from "path";
import { numberToRanges } from "./rangeUtils";

const NIGHT_FURY_SL_2001_BASE_URL = "https://raw.githubusercontent.com/NightFurySL2001/cjktables/refs/heads/master/";

interface NightFurySL2001SetDefinition {
    name: string;
    file: string;
    path?: string;
    countGrouping?: number[];
    col?: number;
    prefix?: string;
    argCol?: number;
}

export const nightFurySL2001Sets: NightFurySL2001SetDefinition[] = [
    // China

    // China Encoding
    { name: "GBK", file: "china/encoding/gbk.txt" },
    { name: "GB/T 12345", file: "china/encoding/gb_t_12345.txt" },
    { name: "GB/T 2312", file: "china/encoding/gb_t_2312.txt" },
    // China Foundry
    { name: "方正字库（简）", file: "china/foundry/fangzheng_jian.txt" },
    { name: "方正字库（简繁）", file: "china/foundry/fangzheng_jianfan.txt" },
    { name: "汉仪字库（简繁）", file: "china/foundry/hanyi_jianfan.txt" },    
    // China Standard
    { name: "《古籍印刷通用字規範字形表》", file: "china/standard/gujiyinshua.txt" },    
    { name: "《现代汉语常用字表》级别 %s", file: "china/standard/xiandai_changyong.txt", path: "china/standard/xiandai_changyong_%s.json", countGrouping: [2500, 2500 + 1000] },    
    { name: "《现代汉语通用字表》级别 %s", file: "china/standard/xiandai_tongyong.txt", path: "china/standard/xiandai_tongyong_%s.json", countGrouping: [3500, 3500 + 3500] },    
    { name: "《义务教育语文课程常用字表》字表 %s", file: "china/standard/yiwu_jiaoyu.txt", path: "china/standard/yiwu_jiaoyu_%s.json", countGrouping: [2500, 2500 + 1000] },
    { name: "《通用规范汉字表》级别 %s", file: "china/standard/tongyong_guifan.txt", path: "china/standard/tongyong_guifan_%s.json", countGrouping: [3500, 3500 + 3000, 3500 + 3000 + 1605] },
    
    // Hong Kong
    
    { name: "《常用字字形表》", file: "hong_kong/hk-changyong.txt" },
    { name: "《香港小學學習字詞表》", file: "hong_kong/hk-xizibiao.txt" },
    { name: "《香港增補字符集》", file: "hong_kong/hkscs.txt" },
    { name: "《常用香港外字表》級別 %s", file: "hong_kong/suppchara.txt", path: "hong_kong/suppchara_%s.json", argCol: 2 },
    
    // Japan

    // Japan Standard
    { name: "人名用漢字", file: "japan/jinmeiyo.txt" },
    { name: "JIS 第一水準", file: "japan/jis-lv1.txt" },
    { name: "JIS 第二水準", file: "japan/jis-lv2.txt" },
    { name: "JIS 第三水準", file: "japan/jis-lv3.txt" },
    { name: "JIS 第四水準", file: "japan/jis-lv4.txt" },
    { name: "常用漢字", file: "japan/joyokanji.txt" },
    { name: "学年別漢字配当表（第 %s 学年）", file: "japan/kyoiku.txt", path: "japan/kyoiku_%s.json", argCol: 2 },
    { name: "日本漢字能力検定 級別漢字表（%s）", file: "japan/kanken.txt", path: "japan/kanken_%s.json", argCol: 2 },

    // Japan encoding
    { name: "JIS X 0208", file: "japan/ref/JIS0208.txt", col: 2, prefix: "0x" },
    { name: "JIS X 0212", file: "japan/ref/JIS0212.txt", prefix: "0x" },
    { name: "Shift-JIS", file: "japan/ref/SHIFTJIS.txt", prefix: "0x" },
    { name: "JIS X 0213:2004", file: "japan/ref/jisx0213-2004-std.txt", prefix: "U+" },

    // Korea

    { name: "Code page 949", file: "korean/CP949.TXT", prefix: "0x" },
    { name: "KS X 1001", file: "korean/KSX1001.txt", prefix: "0x" },

    // Taiwan

    { name: "Big5 (%s)", file: "taiwan/big5-merged.txt", path: "taiwan/big5_%s.json", argCol: 3 },
    { name: "《常用國字標準字體表》", file: "taiwan/standard/edu_standard_1.txt" },
    { name: "《次常用國字標準字體表》", file: "taiwan/standard/edu_standard_2.txt" },
    { name: "《臺灣閩南語常用詞辭典》", file: "taiwan/standard/han_taiyu.txt" },
    { name: "《臺灣客家語常用詞辭典》", file: "taiwan/standard/han_keyu.txt" },
];

export async function getNightFurySL2001Sets() {
    for (const set of nightFurySL2001Sets) {
        const url = NIGHT_FURY_SL_2001_BASE_URL + set.file;
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0 && !line.startsWith("#"));
        const groups: Record<string, number[]> = {};

        lines.forEach((line, index) => {
            const columns = line.split("\t");
            const codepointStr = columns[set.col ?? 1];
            if (!codepointStr) {
                return;
            }
            const codepoint = parseInt(set.prefix ? codepointStr.replace(set.prefix, "") : codepointStr, 16);
            
            let groupName = "default";
            if (set.argCol) {
                const arg = columns[set.argCol].trim();
                if (arg) {
                    groupName = arg.trim();
                }
            } else if (set.countGrouping) {
                const groupIndex = set.countGrouping.findIndex((limit) => index < limit);
                if (groupIndex !== -1) {
                    groupName = (groupIndex + 1).toString();
                }
            }

            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(codepoint);
        });

        for (const [groupName, codepoints] of Object.entries(groups)) {
            const ranges = numberToRanges(codepoints);

            const outputData = {
                name: set.name.replace("%s", groupName),
                codepointRanges: ranges,
            };

            const __dirname = import.meta.dirname;
            const outputPath = path.resolve(
                __dirname,
                "..",
                "nightFurySL2001",
                ...(
                    set.path ? 
                    set.path.replace("%s", groupName) : 
                    set.file.replace(/\.txt$/i, ".json")
                ).split("/"),
            );
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, JSON.stringify(outputData));
            console.log(`Written ${outputPath}`);
        }
    }
}

