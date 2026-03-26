import comnumPkg from '../dist/index.js'; 
import ms from 'ms'; 

const comnum = typeof comnumPkg === 'function' ? comnumPkg : comnumPkg.default;
const iterations = 10_000_000;
const totalParses = iterations * 3;

function runBench(name, parseFn) {
    if (typeof parseFn !== 'function') {
        console.error(`Error: ${name} is not a function! Type is: ${typeof parseFn}`);
        return 0;
    }

    console.log(`\n--- ${name} Benchmark (${totalParses.toLocaleString()} total parses) ---`);
    
    for (let i = 0; i < 100_000; i++) {
        parseFn("5m");
    }

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        parseFn("5m");
        parseFn("10.5h");
        parseFn("-20ms");
    }
    const end = performance.now();
    
    const totalTime = end - start;
    const opTime = (totalTime / totalParses) * 1000000; 

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average: ${opTime.toFixed(2)}ns per parse`);
    console.log(`Ops/sec: ${Math.round(totalParses / (totalTime / 1000)).toLocaleString()}`);
    
    return opTime;
}

const comnumTime = runBench("comnum", comnum);
const msTime = runBench("ms", ms);

if (comnumTime && msTime) {
    const diff = (msTime / comnumTime).toFixed(2);
    console.log(`\nResult: comnum is ${diff}x faster than ms on this machine.`);
}