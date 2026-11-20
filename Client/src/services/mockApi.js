const MOCK_DELAY_MS = 180

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Temporary frontend data layer.
 * These functions simulate network latency only. They are not a real backend,
 * and they do not authenticate, stream, or process payments.
 */
export async function getFoundationStatus() {
  await wait()

  return {
    source: 'mock',
    backendConnected: false,
    useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
    message: 'Customer frontend foundation is running on mock services.',
  }
}
