const path = require('path');
module.exports = {
    entry: {
        "start": path.resolve(__dirname,"./src/start.ts"),
    },
    output: {
        filename: "[name].js",
        path:path.resolve(__dirname,'./dist/js')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            options: {
                exclude: [
                    "node_modules",
                    "deploy"
                ]
            }
        },
        {
            test: /\.json$/,
            use: 'json-loader'
        }
        ]
    },
    externals: {
        "lodash": "_",
        "react": "React",
        "react-dom": "ReactDOM",
        "bluebird": "Promise",
        "sp-pnp-js": "$pnp",
        "office-ui-fabric-react": "Fabric"
    }
}