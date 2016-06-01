import path from "path";
import sh from "shelljs";

let origDir, origShConfigSilent;

export const rootDir = path.join(sh.tempdir(), "titor-fixture-root");

export function standup () {
  origShConfigSilent = sh.config.silent;
  sh.config.silent = true;

  if (sh.test("-e", rootDir)) sh.rm("-rf", rootDir);

  sh.cp("-r", path.join(__dirname, "../../../asset/fixture/_root"), rootDir);
  sh.ln(
    "-s",
    path.join(__dirname, "../../../node_modules"),
    path.join(rootDir, "node_modules"),
  );

  origDir = process.env.PWD;
  sh.cd(rootDir);
}

export function teardown () {
  sh.config.silent = origShConfigSilent;
  sh.cd(origDir);
  sh.rm("-rf", rootDir);
}
