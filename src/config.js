/* eslint-disable */
const conf = {
    "production": {
        api:"https://api.trxplorer.io/v2"
    },
    "development": {
        api:"http://localhost:7171/v2"
    }

}
export default conf[process.env.NODE_ENV]
