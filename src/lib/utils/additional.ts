import axios from "axios";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Jakarta");

type GiftIDR = {
    from?: string;
    to?: string;
    res?: number;
    rates?: number;
};

function numberWithCommas(x: number): String {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

function count_time(t1: number, t2: number): String {
    const time1 = moment(t1);
    const time2 = moment(t2);
    const seberapa_lama = moment(t2 * 1000).diff(t1 * 1000);
    const jam = moment.duration(seberapa_lama).hours();
    const menit = moment.duration(seberapa_lama).minutes();
    const detik = moment.duration(seberapa_lama).seconds();
    return `${jam > 9 ? jam : "0" + jam}:${menit > 9 ? menit : "0" + menit}:${detik > 9 ? detik : "0" + detik}`;
}

function convertCurrency(from: string, to: string, num: number): Promise<GiftIDR> {
    return new Promise((resolve, reject) => {
        axios
            .get("https://www.xe.com/api/protected/charting-rates/?fromCurrency=" + from + "&toCurrency=" + to, {
                headers: { Authorization: "Basic bG9kZXN0YXI6cHVnc25heA==" },
            })
            .then((res) => {
                let jumlahkan =
                    num *
                    res.data.batchList[res.data.batchList.length - 1].rates[
                        res.data.batchList[res.data.batchList.length - 1].rates.length - 1
                    ];
                resolve({
                    from,
                    to,
                    rates: res.data.batchList[res.data.batchList.length - 1].rates[
                        res.data.batchList[res.data.batchList.length - 1].rates.length - 1
                    ],
                    res: jumlahkan,
                });
            })
            .catch((e) => {
                reject(e);
            });
    });
}

export { numberWithCommas, count_time, convertCurrency };
