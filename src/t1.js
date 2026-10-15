const run=require('./t.js');(async()=>{const r=await run(process.argv[2]||'ATA');console.log(r)})().catch(e=>{console.error(e)});
