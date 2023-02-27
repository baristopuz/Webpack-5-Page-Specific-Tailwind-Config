const fs = require('fs');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");


const smp = new SpeedMeasurePlugin({
    outputFormat: "humanVerbose",
    loaderTopFiles: 10,
});


//TODO: Glob işlemini fonksiyon haline getir.
let jsFiles = glob.sync(path.resolve(__dirname, 'assets/src/js/page_**.js')).reduce(function (obj, el) {
    obj[path.parse(el).name] = el;
    return obj
}, {});

let cssFiles = glob.sync(path.resolve(__dirname, 'assets/src/css/*.css')).reduce(function (obj, el) {
    obj[path.parse(el).name] = el;
    return obj
}, {});

// console.log(cssFiles);
// process.exit();


// cssFiles.subpage = path.resolve(__dirname, 'assets/src/scss/subpage.scss');
jsFiles.subpage = path.resolve(__dirname, 'assets/src/js/subpage.js');;

let config = {
    // mode: 'development',
    watch: true,
    // devtool: 'inline-source-map',
    watchOptions: {
        aggregateTimeout: 50,
        ignored: /node_modules/,
    },
    performance: {
        // maxAssetSize: 1000000,
        hints: false
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            parallel: true,
        })],
    },
};

jsConfig = Object.assign({}, config,
    {
        entry: jsFiles,
        output: {
            path: path.resolve(__dirname, 'assets/dist/js'),
            filename: '[name]__[contenthash:8].js',
            //Yeni dosya oluştuğunda önceki dosyanın yerine geçsin, clean false olursa sürekli yeni dosya oluşur
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }],
                }
            ]
        },
        plugins: [
            new WebpackManifestPlugin({
                fileName: 'manifest.json',
                //public path verilmediği için plugin otomatik olarak manifestteki dosya adına auto/ ekliyor. bu şekilde replace edebiliriz, ya da publicPath belirlemeliyiz.
                map: f => {
                    f.path = f.path.replace(/^auto\//i, '');
                    return f;
                }
            }),
        ]
    });

cssConfig = Object.assign({}, config,
    {
        entry: cssFiles,
        output: {
            path: path.resolve(__dirname, 'assets/dist/css'),
            filename: 'delete_[name].css',
            clean: true,
            // publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'cache-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            require('tailwindcss'),
                                            require('autoprefixer'),
                                            // require('cssnano'),
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                }
            ]
        },
        plugins: [
            //Yukarıdaki işlemler bittikten sonra bu plugini çalıştır,
            //Bu pluginin içinde de silinecek dosyaları glob paketi ile objede tut, ve obje değerlerini teker teker gez, her gezdiğini sil 
            //Bu işlemin yapılmasının sebebi webpack js üzerine bir yapıya sahiptir, dolayısıyla çift dosya derleme yapıyor, output css olsa bile hem hashli hemde outputdaki çıktı olarak geliyor.

            new WebpackShellPluginNext({
                onBuildEnd: {
                    scripts: [
                        // Burası npm run wppprod yapınca çalışıyor fakat her derlemede çalışmıyor.
                        () => {
                            const cssFiles = glob.sync(path.resolve(__dirname, 'assets/dist/css/delete_**.css')).reduce(function (obj, el) {
                                obj[path.parse(el).name] = el;
                                return obj
                            }, {});

                            // cssFiles.subpage = path.resolve(__dirname, 'assets/dist/css/delete_subpage.css');

                            Object.values(cssFiles).forEach(val => {
                                try {
                                    fs.unlinkSync(val)
                                } catch (err) {
                                    console.error(err)
                                }
                            });


                        }
                    ]
                }
            }),

            new WebpackManifestPlugin({
                fileName: 'manifest.json',
                removeKeyHash: true,
                //public path verilmediği için plugin otomatik olarak manifestteki dosya adına auto/ ekliyor. bu şekilde replace edebiliriz, ya da publicPath belirlemeliyiz.
                map: f => {
                    f.path = f.path.replace(/^auto\//i, '');
                    return f;
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name]__[contenthash:8].css',
            }),


        ]
    });

// const SMPJS = new SpeedMeasurePlugin().wrap(jsConfig);
// const SMPCSS = new SpeedMeasurePlugin().wrap(cssConfig);
// SMPCSS.plugins.push(
//     new MiniCssExtractPlugin({
//         filename: '[name]__[contenthash].css',
//     })
// );




module.exports = [
    cssConfig,
    // jsConfig
    // SMPJS,
    // SMPCSS
]