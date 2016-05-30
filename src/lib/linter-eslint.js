export default function LinterEslint (sh) {
  return {
    run () { return sh.exec("eslint --fix .") },
  };
}
