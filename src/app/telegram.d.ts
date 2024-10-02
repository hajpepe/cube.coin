interface TelegramWebApp {
     ready: () => void;
     // Add other Telegram WebApp methods and properties as needed
   }
   
   interface Window {
     Telegram?: {
       WebApp: TelegramWebApp;
     };
   }