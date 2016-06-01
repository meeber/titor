export default function LinterEslint (sh) {
  return {
    run () { return sh.execAsync("eslint --fix .") },
  };
}
