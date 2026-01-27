import { useState, useEffect } from 'react';
import { useTokens } from '../hooks/useTokens';

export default function TokenTestComponent() {
  // Получаем все методы и состояние из хранилища
  const {
    access_token,
    refresh_token,
    setTokens,
    clearTokens,
    getToken,
    isTokenValid
  } = useTokens();

  // Состояние для отображения информации
  const [tokenInfo, setTokenInfo] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Функция для логирования тестов
  const logTest = (message) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Функция для декодирования и отображения информации о токене
  const decodeAndDisplayToken = () => {
    if (!access_token) {
      setTokenInfo({ error: 'Токен отсутствует' });
      return;
    }

    try {
      // Исправленная версия для base64url
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      
      setTokenInfo({
        raw: access_token.substring(0, 50) + '...',
        payload,
        expires: new Date(payload.exp * 1000).toLocaleString(),
        isExpired: payload.exp * 1000 < Date.now()
      });
    } catch (error) {
      setTokenInfo({ error: `Ошибка декодирования: ${error.message}` });
    }
  };

  // Тестовые токены (для демонстрации)
  const TEST_TOKENS = {
    // Валидный токен (истекает через 1 час)
    valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIxNjYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    
    // Просроченный токен (истек в 2018)
    expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ',
    
    // Невалидный токен (неправильный формат)
    invalid: 'not-a-valid-jwt-token'
  };

  // Тест 1: Установка валидного токена
  const testSetValidToken = () => {
    logTest('Устанавливаю валидный токен...');
    setTokens({
      access_token: TEST_TOKENS.valid,
      refresh_token: 'valid_refresh_token_123'
    });
    setTimeout(decodeAndDisplayToken, 100);
  };

  // Тест 2: Установка просроченного токена
  const testSetExpiredToken = () => {
    logTest('Устанавливаю просроченный токен...');
    setTokens({
      access_token: TEST_TOKENS.expired,
      refresh_token: 'expired_refresh_token_456'
    });
    setTimeout(decodeAndDisplayToken, 100);
  };

  // Тест 3: Установка невалидного токена
  const testSetInvalidToken = () => {
    logTest('Устанавливаю невалидный токен...');
    setTokens({
      access_token: TEST_TOKENS.invalid,
      refresh_token: 'invalid_refresh_token_789'
    });
    setTimeout(decodeAndDisplayToken, 100);
  };

  // Тест 4: Проверка валидности
  const testTokenValidity = () => {
    const isValid = isTokenValid();
    const token = getToken();
    logTest(`Проверка валидности: ${isValid ? '✅ ВАЛИДНЫЙ' : '❌ НЕВАЛИДНЫЙ'}`);
    logTest(`Токен через getToken(): ${token ? token.substring(0, 30) + '...' : 'null'}`);
  };

  // Тест 5: Очистка токенов
  const testClearTokens = () => {
    logTest('Очищаю токены...');
    clearTokens();
    setTokenInfo(null);
  };

  // Тест 6: Проверка работы getToken()
  const testGetToken = () => {
    const token = getToken();
    logTest(`getToken() вернул: ${token ? 'токен (есть значение)' : 'null'}`);
  };

  // Автоматически декодируем токен при его изменении
  useEffect(() => {
    decodeAndDisplayToken();
  }, [access_token]);

  // Очищаем логи каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (testResults.length > 10) {
        setTestResults([]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [testResults]);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '20px auto',
      fontFamily: 'monospace'
    }}>
      <h2>🔐 Тестирование хранилища токенов</h2>
      
      {/* Текущее состояние */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Текущее состояние хранилища:</h3>
        <p><strong>access_token:</strong> {access_token ? '✅ Установлен' : '❌ Отсутствует'}</p>
        <p><strong>refresh_token:</strong> {refresh_token ? '✅ Установлен' : '❌ Отсутствует'}</p>
        <p><strong>isTokenValid():</strong> {isTokenValid() ? '✅ true' : '❌ false'}</p>
      </div>

      {/* Информация о декодированном токене */}
      {tokenInfo && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '5px' }}>
          <h3>Информация о токене:</h3>
          {tokenInfo.error ? (
            <p style={{ color: 'red' }}>❌ {tokenInfo.error}</p>
          ) : (
            <>
              <p><strong>Токен (первые 50 символов):</strong> {tokenInfo.raw}</p>
              <p><strong>Данные (payload):</strong></p>
              <pre style={{ background: '#fff', padding: '10px', borderRadius: '5px' }}>
                {JSON.stringify(tokenInfo.payload, null, 2)}
              </pre>
              <p><strong>Истекает:</strong> {tokenInfo.expires}</p>
              <p><strong>Статус:</strong> {tokenInfo.isExpired ? '❌ ПРОСРОЧЕН' : '✅ АКТИВЕН'}</p>
            </>
          )}
        </div>
      )}

      {/* Кнопки тестов */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Действия:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={testSetValidToken} style={buttonStyle('#4CAF50')}>
            Установить валидный токен
          </button>
          <button onClick={testSetExpiredToken} style={buttonStyle('#ff9800')}>
            Установить просроченный токен
          </button>
          <button onClick={testSetInvalidToken} style={buttonStyle('#f44336')}>
            Установить невалидный токен
          </button>
          <button onClick={testTokenValidity} style={buttonStyle('#2196F3')}>
            Проверить валидность
          </button>
          <button onClick={testGetToken} style={buttonStyle('#9C27B0')}>
            Проверить getToken()
          </button>
          <button onClick={testClearTokens} style={buttonStyle('#607D8B')}>
            Очистить токены
          </button>
        </div>
      </div>

      {/* Логи тестов */}
      <div>
        <h3>Логи тестов:</h3>
        <div style={{ 
          height: '200px', 
          overflowY: 'auto', 
          background: '#333', 
          color: '#0f0', 
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResults.length === 0 ? (
            <p>Тесты не запущены. Нажмите любую кнопку выше.</p>
          ) : (
            testResults.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {log}
              </div>
            ))
          )}
        </div>
        {testResults.length > 0 && (
          <button 
            onClick={() => setTestResults([])} 
            style={{ ...buttonStyle('#777'), marginTop: '10px' }}
          >
            Очистить логи
          </button>
        )}
      </div>
    </div>
  );
}

// Стиль для кнопок
const buttonStyle = (color) => ({
  padding: '10px 15px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'opacity 0.3s'
});