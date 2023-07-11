const FormatTime = (time) => {
    return `${time.getFullYear()}-${
        time.getMonth() + 1
    }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
};

module.exports = FormatTime;
