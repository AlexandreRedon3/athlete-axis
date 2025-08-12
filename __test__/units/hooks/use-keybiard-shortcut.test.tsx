// __test__/units/hooks/use-keybiard-shortcut.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useKeyboardShortcuts } from "../../../src/hooks/use-keybiard-shortcut";

describe("use-keybiard-shortcut hook", () => {
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock des événements du DOM
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();
    
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    
    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useKeyboardShortcuts", () => {
    it("devrait initialiser les raccourcis clavier", () => {
      // Act
      const { result } = renderHook(() => useKeyboardShortcuts());

      // Assert
      expect(result.current.shortcuts).toHaveLength(4);
      expect(result.current.isCommandPaletteOpen).toBe(false);
      expect(typeof result.current.setIsCommandPaletteOpen).toBe("function");
    });

    it("devrait avoir les bons raccourcis configurés", () => {
      // Act
      const { result } = renderHook(() => useKeyboardShortcuts());

      // Assert
      const shortcuts = result.current.shortcuts;
      
      expect(shortcuts[0]).toEqual({
        key: 'k',
        ctrlKey: true,
        action: expect.any(Function),
        description: 'Ouvrir la palette de commandes'
      });

      expect(shortcuts[1]).toEqual({
        key: 'n',
        ctrlKey: true,
        action: expect.any(Function),
        description: 'Créer un nouveau programme'
      });

      expect(shortcuts[2]).toEqual({
        key: 'i',
        ctrlKey: true,
        action: expect.any(Function),
        description: 'Inviter un client'
      });

      expect(shortcuts[3]).toEqual({
        key: 's',
        ctrlKey: true,
        shiftKey: true,
        action: expect.any(Function),
        description: 'Planifier une séance'
      });
    });

    it("devrait ajouter un écouteur d'événement keydown", () => {
      // Act
      renderHook(() => useKeyboardShortcuts());

      // Assert
      expect(mockAddEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("devrait supprimer l'écouteur d'événement lors du démontage", () => {
      // Act
      const { unmount } = renderHook(() => useKeyboardShortcuts());

      // Assert
      expect(mockAddEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));

      // Démonter le hook
      unmount();

      // Assert
      expect(mockRemoveEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("devrait ouvrir la palette de commandes avec Ctrl+K", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Act
      const mockEvent = {
        key: "k",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent);

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("devrait fermer la palette avec Escape", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Simuler l'ouverture de la palette
      result.current.setIsCommandPaletteOpen(true);

      // Act
      const mockEvent = {
        key: "Escape",
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent);

      // Assert
      expect(result.current.isCommandPaletteOpen).toBe(false);
    });

    it("ne devrait pas réagir aux touches non configurées", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Act
      const mockEvent = {
        key: "x",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent);

      // Assert
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("devrait gérer les raccourcis avec Shift", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Act
      const mockEvent = {
        key: "s",
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent);

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("devrait gérer les raccourcis avec Alt", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Act
      const mockEvent = {
        key: "i",
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent);

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("devrait gérer les touches en majuscules et minuscules", () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Act - Test avec majuscule
      const mockEvent1 = {
        key: "K",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent1);

      // Assert
      expect(mockEvent1.preventDefault).toHaveBeenCalled();

      // Act - Test avec minuscule
      const mockEvent2 = {
        key: "k",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        preventDefault: vi.fn(),
      };

      eventHandler(mockEvent2);

      // Assert
      expect(mockEvent2.preventDefault).toHaveBeenCalled();
    });

    it("devrait permettre de changer l'état de la palette", async () => {
      // Arrange
      const { result } = renderHook(() => useKeyboardShortcuts());

      // Act
      result.current.setIsCommandPaletteOpen(true);

      // Assert
      await waitFor(() => {
        expect(result.current.isCommandPaletteOpen).toBe(true);
      });

      // Act
      result.current.setIsCommandPaletteOpen(false);

      // Assert
      await waitFor(() => {
        expect(result.current.isCommandPaletteOpen).toBe(false);
      });
    });
  });
}); 