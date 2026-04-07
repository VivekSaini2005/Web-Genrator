const code = `json
{
  "title": "hello"
}`;
const m = code.match(/\{[\s\S]*.*\}/);
console.log("MATCH:\n", m ? m[0] : null);
