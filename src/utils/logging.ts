import pc from "picocolors";

const info = (...data: any[]) => {
    console.log(pc.blue(pc.bold("info")), ...data);
};

const warn = (...data: any[]) => {
    console.warn(pc.yellow(pc.bold("warning")), ...data);
};

const error = (...data: any[]) => {
    console.error(pc.red(pc.bold("error")), ...data);
};

const success = (...data: any[]) => {
    console.error(pc.green(pc.bold("success")), ...data);
};

export { info, warn, error, success };
