
function render(ctx) {

    // Process various option toggles
    //


    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //


    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //

    // The core rendering of the actual game / simulation
    //
    renderSimulation(ctx);
  

}
