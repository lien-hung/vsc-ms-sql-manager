import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { useVSCode } from '../../context/VSCodeContext';

// Mock the VSCode context
vi.mock('../../context/VSCodeContext', () => ({
  useVSCode: vi.fn(),
}));

// Mock child components to isolate Toolbar behavior
vi.mock('./ExecuteButton', () => ({
  ExecuteButton: () => <div data-testid="execute-button" />,
}));
vi.mock('./ConnectionDropdown', () => ({
  ConnectionDropdown: () => <div data-testid="connection-dropdown" />,
}));
vi.mock('./DatabaseDropdown', () => ({
  DatabaseDropdown: () => <div data-testid="database-dropdown" />,
}));
vi.mock('./FormatButton', () => ({
  FormatButton: () => <div data-testid="format-button" />,
}));

describe('Toolbar', () => {
  const defaultProps = {
    onExecute: vi.fn(),
    onEstimatedPlan: vi.fn(),
    onFormat: vi.fn(),
    isExecuting: false,
    includeActualPlan: false,
    onToggleActualPlan: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without custom toolbar color when connection has no color', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [
        { id: 'conn1', name: 'Test Server', server: 'localhost', connectionType: 'server' },
      ],
      currentConnectionId: 'conn1',
    } as any);

    const { container } = render(<Toolbar {...defaultProps} />);
    const toolbar = container.querySelector('#toolbar') as HTMLElement;
    expect(toolbar).toBeDefined();
    expect(toolbar?.style.backgroundColor).toBe('');
    expect(toolbar?.classList.contains('toolbar-colored')).toBe(false);
  });

  it('applies custom toolbar color from active connection', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [
        { id: 'conn1', name: 'Production', server: 'prod-server', connectionType: 'server', color: '#ff0000' },
      ],
      currentConnectionId: 'conn1',
    } as any);

    const { container } = render(<Toolbar {...defaultProps} />);
    const toolbar = container.querySelector('#toolbar') as HTMLElement;
    expect(toolbar?.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(toolbar?.classList.contains('toolbar-colored')).toBe(true);
  });

  it('does not apply color when no connection is selected', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: false,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [
        { id: 'conn1', name: 'Test', server: 'localhost', connectionType: 'server', color: '#00ff00' },
      ],
      currentConnectionId: null,
    } as any);

    const { container } = render(<Toolbar {...defaultProps} />);
    const toolbar = container.querySelector('#toolbar') as HTMLElement;
    expect(toolbar?.style.backgroundColor).toBe('');
    expect(toolbar?.classList.contains('toolbar-colored')).toBe(false);
  });

  it('applies color from the correct connection when multiple exist', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [
        { id: 'conn1', name: 'Dev', server: 'dev-server', connectionType: 'server', color: '#00ff00' },
        { id: 'conn2', name: 'Prod', server: 'prod-server', connectionType: 'server', color: '#ff0000' },
      ],
      currentConnectionId: 'conn2',
    } as any);

    const { container } = render(<Toolbar {...defaultProps} />);
    const toolbar = container.querySelector('#toolbar') as HTMLElement;
    expect(toolbar?.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('removes toolbar color when switching to a connection without color', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [
        { id: 'conn1', name: 'Dev', server: 'dev-server', connectionType: 'server', color: '#00ff00' },
        { id: 'conn2', name: 'Staging', server: 'staging-server', connectionType: 'server' },
      ],
      currentConnectionId: 'conn2',
    } as any);

    const { container } = render(<Toolbar {...defaultProps} />);
    const toolbar = container.querySelector('#toolbar') as HTMLElement;
    expect(toolbar?.style.backgroundColor).toBe('');
    expect(toolbar?.classList.contains('toolbar-colored')).toBe(false);
  });

  it('displays status label "Ready" when connected', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [],
      currentConnectionId: null,
    } as any);

    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText('Ready')).toBeDefined();
  });

  it('displays status label "Executing..." during query execution', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: true,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [],
      currentConnectionId: null,
    } as any);

    render(<Toolbar {...defaultProps} isExecuting={true} />);
    expect(screen.getByText('Executing...')).toBeDefined();
  });

  it('displays status label "Not Connected" when disconnected', () => {
    vi.mocked(useVSCode).mockReturnValue({
      isConnected: false,
      cancelQuery: vi.fn(),
      manageConnections: vi.fn(),
      connections: [],
      currentConnectionId: null,
    } as any);

    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText('Not Connected')).toBeDefined();
  });
});
