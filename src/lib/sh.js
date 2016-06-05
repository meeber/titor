import sh from "shelljs";

sh.config.fatal = true;

sh.execAsync = function execAsync (cmd) {
  return new Promise((resolve, reject) => {
    sh.exec(cmd, (code, stdout, stderr) => {
      let details = {cmd, code, stdout, stderr};

      if (code) reject(Object.assign(Error("Script error"), details));
      else resolve(details);
    });
  });
};

export default sh;
