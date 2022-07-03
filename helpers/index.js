const generarPassword = () => {
    const ramdon = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);

    return ramdon + fecha;
};

module.exports = {
    generarPassword,
};
