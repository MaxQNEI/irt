export function rand(a = 0, b = 1) {
    return Math.round(Math.random() * (b - a) + a);
}

export function randOf(a = []) {
    return a[rand(0, a.length - 1)];
}

export function randStr(length = 32, use = "dls") {
    const s = [
        use.indexOf("d") !== -1 && "0123456789",
        use.indexOf("l") !== -1 && "abcdefghijklmnopqrstuvwxyz",
        use.indexOf("s") !== -1 && "_-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$"
    ]
        .filter((v) => v)
        .join("");

    return new Array(length)
        .fill(null)
        .map(() => randOf(s)[randOf(["toLowerCase", "toUpperCase"])]())
        .join("");
}
