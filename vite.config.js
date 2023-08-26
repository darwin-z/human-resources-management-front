import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import { svgBuilder } from "./src/utils/icon-builder.js"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgBuilder("./src/assets/svg/")],
    // ...
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"), // 路径别名
        },
        extensions: [".js", ".json", ".ts"], // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
})
