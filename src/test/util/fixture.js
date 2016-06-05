import {join} from "path";
import {cd, config, cp, ln, rm, tempdir, test} from "../../lib/sh";

let origDir, origShConfigSilent;

export const rootDir = join(tempdir(), "titor-fixture-root");

export function standup () {
  origShConfigSilent = config.silent;
  config.silent = true;

  if (test("-e", rootDir)) rm("-rf", rootDir);

  cp("-r", join(__dirname, "../../../asset/fixture/_root"), rootDir);
  ln(
    "-s",
    join(__dirname, "../../../node_modules"),
    join(rootDir, "node_modules"),
  );

  origDir = process.env.PWD;
  cd(rootDir);
}

export function teardown () {
  config.silent = origShConfigSilent;
  cd(origDir);
  rm("-rf", rootDir);
}
