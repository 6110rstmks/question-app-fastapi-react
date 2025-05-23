import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';

const KeyboardShortcuts: React.FC = () => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i' && event.metaKey) {
      event.preventDefault();
      navigate('/set_question');
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null; // UIに表示しない
};

export default KeyboardShortcuts;
