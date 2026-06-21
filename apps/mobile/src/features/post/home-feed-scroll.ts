interface HomeFeedScrollState {
  handler: (() => void) | null;
}

const homeFeedScrollState = createHomeFeedScrollState();

function createHomeFeedScrollState(
  state: HomeFeedScrollState = { handler: null },
) {
  return state;
}

export function setScrollHomeFeedToTopHandler(handler: () => void) {
  homeFeedScrollState.handler = handler;
  return () => {
    if (homeFeedScrollState.handler === handler) {
      homeFeedScrollState.handler = null;
    }
  };
}

export function scrollHomeFeedToTop() {
  homeFeedScrollState.handler?.();
}
