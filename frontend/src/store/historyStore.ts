import { create } from 'zustand'

interface HistoryState {
  image: string | null
  processedImage: string | null
  mask: string | null
  canvasState: string | null
  history: Array<{
    image: string | null
    processedImage: string | null
    mask: string | null
    canvasState: string | null
    timestamp: number
  }>
  historyIndex: number
  maxHistorySize: number
  
  // Actions
  setImage: (image: string | null) => void
  setProcessedImage: (image: string | null) => void
  setMask: (mask: string | null) => void
  setCanvasState: (state: string | null) => void
  saveState: () => void
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  reset: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  image: null,
  processedImage: null,
  mask: null,
  canvasState: null,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  setImage: (image) => set({ image }),
  
  setProcessedImage: (processedImage) => set({ processedImage }),
  
  setMask: (mask) => set({ mask }),
  
  setCanvasState: (canvasState) => set({ canvasState }),

  saveState: () => {
    const state = get()
    const newState = {
      image: state.image,
      processedImage: state.processedImage,
      mask: state.mask,
      canvasState: state.canvasState,
      timestamp: Date.now(),
    }

    // Remove any states after current index (when undoing then making new changes)
    const history = state.history.slice(0, state.historyIndex + 1)
    
    // Add new state
    history.push(newState)
    
    // Limit history size
    const limitedHistory = history.slice(-state.maxHistorySize)
    
    set({
      history: limitedHistory,
      historyIndex: limitedHistory.length - 1,
    })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex <= 0) return false

    const prevIndex = state.historyIndex - 1
    const prevState = state.history[prevIndex]

    set({
      image: prevState.image,
      processedImage: prevState.processedImage,
      mask: prevState.mask,
      canvasState: prevState.canvasState,
      historyIndex: prevIndex,
    })

    return true
  },

  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) return false

    const nextIndex = state.historyIndex + 1
    const nextState = state.history[nextIndex]

    set({
      image: nextState.image,
      processedImage: nextState.processedImage,
      mask: nextState.mask,
      canvasState: nextState.canvasState,
      historyIndex: nextIndex,
    })

    return true
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  clearHistory: () => {
    set({
      history: [],
      historyIndex: -1,
    })
  },

  reset: () => {
    set({
      image: null,
      processedImage: null,
      mask: null,
      canvasState: null,
      history: [],
      historyIndex: -1,
    })
  },
}))

