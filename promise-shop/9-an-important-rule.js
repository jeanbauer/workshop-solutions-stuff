/*
# There's always a catch… (lol pun)

Promises are designed to emulate synchronous control flows.
If any of them throw an exception, the exception will bubble up
through the stack until it is caught by a catch block or
hits the global context where it will be thrown.

In the code below, each expression is evaluated one after the
other.  If any expression throws an exception, all subsequent
expressions will not be executed and the catch block
will catch and handle it.

    try {
      doStuff()
      doMoreStuff()
    } catch (err) {
      complainAboutJavascript(err);
    }

With promises, we can achieve a very similar control flow as shown
(assume all functions return promises):

    doStuff()
    .then(doMoreStuff)
    .then(null, complainAboutJavascript);

Maybe we should combine the last two lines since one is a fulfill
handler and the other is a rejection handler?  NO!  While this
might initially seem sensible consider what would happen if
doMoreStuff threw an error.  Since the promise returned from it
would be rejected, it would look for the next rejection handler
to handle it.

Remember: A promise can never resolve more than once.

It is, therefore, a best practice to always put a rejection handler
at the bottom of your promise chain (much like a catch block).

It is worth pointing out that both the synchronous and asynchronous
code have the same problem.  If the rejection handler itself throws
an error you are going to have a bad time.

Many promise libraries try to ameliorate this problem for you
by providing a done handler that simply handles any uncaught
errors.  The rule of thumb is this:

  > If you are **not** returning a value from your promise to a caller,
  > then attach a `done` handler to guard against uncaught exceptions.

An example is shown below:

    doStuff()
    .then(doMoreStuff)
    .then(null, complainAboutJavascript)
    .done();

## Task

We are going to demonstrate this to ourselves by creating a chain
of functions that all print to the console.

  * Create a function `alwaysThrows` that throws an `Error` withtext `"OH NOES"`;
  * Create a function `iterate` that prints the first argument(an integer) to it and then returns that argument + 1;
  * Create a promise chain that wraps your iterate method using Q's`fcall` then a series of iterations that attempts to perform `iterate`a total of 10 times.
  * Attach `console.log` as a rejection handler at the bottom of yourchain.
  * Insert a call to `alwaysThrows` after your 5th call of `iterate`

If you have done this correctly, your code should print 1,2,3,4,5,
"[Error: OH NOES]".  It's important to notice that the thrown exception was
turned into a rejected promise which caused the rejected promise to
travel down the promise chain to the first available rejection handler.

## Bonus

Try swapping your rejection handler from console.log to alwaysThrows.
Your program will now throw an exception in the global context!  Ahh!
Try to fix this using the approach described above.


 » To print these instructions again, run: promise-it-wont-hurt print
 » To execute your program in a test environment, run: promise-it-wont-hurt run program.js
 » To verify your program, run: promise-it-wont-hurt verify program.js
 » For help run: promise-it-wont-hurt help
*/

function iterate(num) {
  console.log(num);
  return ++num;
};

function alwaysThrows () {
  throw new Error('OH NOES');
};

Promise.resolve(iterate(1))
  .then(iterate)
  .then(iterate)
  .then(iterate)
  .then(iterate)
  .then(alwaysThrows)
  .then(iterate)
  .then(iterate)
  .then(iterate)
  .then(iterate)
  .then(iterate)
  .then(null, console.log);
