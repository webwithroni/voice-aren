# AREN Architecture

## System Boundary

AREN is divided into independent layers.

### Voice Runtime

Responsible for real-time voice transport and Gemini Live communication.

### Runtime State

Responsible for translating voice and agent events into authoritative AREN states.

### UI State

Responsible for presenting runtime state through StateFlow/ViewModel.

### Visual System

Responsible for Orb, status, controls, motion, accessibility, and visual tokens.

## Dependency Direction

UI → Runtime State → Voice Runtime

The UI must not directly depend on Gemini WebSocket implementation details.

## State Model

IDLE
LISTENING
HEARING
THINKING
PLANNING
EXECUTING
SPEAKING
VERIFYING
SUCCESS
ERROR
PAUSED
OFFLINE
BACKUP

## Future Voice Pipeline

Microphone
↓
Audio Capture
↓
Gemini Live WebSocket
↓
Voice Runtime
↓
AREN Runtime Controller
↓
StateFlow
↓
Compose UI
↓
AREN Orb
