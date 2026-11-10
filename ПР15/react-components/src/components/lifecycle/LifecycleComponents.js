import React, { Component } from "react";
import "./LifecycleComponents.css";

// 5.1. Таймер
class Timer extends Component {
  state = { seconds: 0, isRunning: false };

  componentDidMount() {
    // Запускаем таймер, если isRunning = true
    if (this.state.isRunning) this.startInterval();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isRunning !== this.state.isRunning) {
      if (this.state.isRunning) this.startInterval();
      else clearInterval(this.intervalId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  startInterval = () => {
    this.intervalId = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  };

  render() {
    return (
      <div className="lifecycle-box">
        <h4>Секундомер</h4>
        <div className="timer-display">{this.state.seconds} сек.</div>
        <button
          onClick={() => this.setState({ isRunning: !this.state.isRunning })}
        >
          {this.state.isRunning ? "Пауза" : "Старт"}
        </button>
        <button onClick={() => this.setState({ seconds: 0, isRunning: false })}>
          Сброс
        </button>
      </div>
    );
  }
}

// 5.2. Размер окна
class WindowSizeTracker extends Component {
  state = { width: window.innerWidth, height: window.innerHeight };

  handleResize = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return (
      <div className="lifecycle-box">
        <h4>Размер окна</h4>
        <p>Ширина: {this.state.width}px</p>
        <p>Высота: {this.state.height}px</p>
      </div>
    );
  }
}

// 5.3. Загрузка данных
class DataFetcher extends Component {
  state = { data: [], loading: false, error: null };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const res = await fetch(this.props.url);
      if (!res.ok) throw new Error("Ошибка сети");
      const data = await res.json();
      this.setState({ data: data.slice(0, 3), loading: false }); // Берем первые 3 для примера
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    if (this.state.loading)
      return <div className="lifecycle-box">Загрузка...</div>;
    if (this.state.error)
      return (
        <div className="lifecycle-box" style={{ color: "red" }}>
          {this.state.error}
        </div>
      );

    return (
      <div className="lifecycle-box">
        <h4>Данные с API</h4>
        <ul>
          {this.state.data.map((item) => (
            <li key={item.id}>{item.name || item.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

class LifecycleComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Жизненный цикл компонентов</h2>
        <div className="component-demo">
          <h3>Задание 5: Методы жизненного цикла</h3>
          <div id="lifecycle-output" className="output">
            <Timer />
            <WindowSizeTracker />
            <DataFetcher url="https://jsonplaceholder.typicode.com/users" />
          </div>
        </div>
      </section>
    );
  }
}

export default LifecycleComponents;
