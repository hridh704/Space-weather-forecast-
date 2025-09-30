# Cosmic Forecast 🌌

**Your daily link between Earth and Space weather.**

Cosmic Forecast is a futuristic weather application that visualizes and compares real-time Earth and Space weather data fetched from NASA's public APIs. It features a sleek, glassmorphism-inspired UI with neon accents, designed to be both beautiful and educational.

*Note: You can replace the placeholder below with a screenshot of the running application.*
![Cosmic Forecast Screenshot](placeholder.png)

## ✨ Features

-   **Dual Weather Dashboards:** Separate, beautifully designed cards for Earth 🌍 and Space ☀️ weather.
-   **Live NASA Data:**
    -   🌍 **Earth Weather:** Temperature, wind speed, and humidity from NASA's POWER API.
    -   ☀️ **Space Weather:** Coronal Mass Ejections (CMEs) and Geomagnetic Storms (Kp-Index) from NASA's DONKI API.
-   **7-Day Forecast:** A scrollable strip showing a full week's forecast for both Earth and Space.
-   **Interactive Data Visualizer:**
    -   Compare historical Earth Temperature vs. Solar Wind.
    -   Compare historical Earth Wind vs. Solar Wind.
    -   Visualize Geomagnetic Activity (CME counts vs. Kp-Index).
    -   See a Kp-Index forecast gauge for the week ahead.
-   **Educational Content:** Learn how both types of weather impact our lives and technology.
-   **Responsive Design:** Looks great on desktops, tablets, and mobile devices.
-   **Animated Background:** Subtle, cosmic particle animations for an immersive experience.

## 🛠️ Tech Stack

-   **Framework:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **Charting:** [Recharts](https://recharts.org/)
-   **Build:** No build step! Runs directly in the browser with ES Modules and an import map.

## 🚀 Getting Started

This project is designed to run directly in the browser without any build steps.

### Prerequisites

You need a modern web browser that supports ES Modules (e.g., Chrome, Firefox, Safari, Edge).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cosmic-forecast.git
    cd cosmic-forecast
    ```

2.  **Get a NASA API Key:**
    This project uses NASA's public APIs. To get your own free API key, visit [api.nasa.gov](https://api.nasa.gov/).

3.  **Create a config file:**
    In the project root, create a file named `config.ts` by copying the example file:
    ```bash
    cp config.example.ts config.ts
    ```
    Now, open `config.ts` and replace `'YOUR_NASA_API_KEY_HERE'` with your actual NASA API key.

    ```ts
    // config.ts
    export const NASA_API_KEY = 'your_actual_api_key';
    ```

4.  **Run the application:**
    Since there's no build server, you can simply open the `index.html` file in your browser. For the best experience (and to avoid potential CORS issues with local files), it's recommended to serve the directory with a simple local server.

    If you have Python installed:
    ```bash
    # Python 3
    python -m http.server
    ```
    Then, open your browser and navigate to `http://localhost:8000`.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
