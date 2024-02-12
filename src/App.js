import Editor from './Editor';
import './App.css';

export default function App() {

  return (
    <div className="App">
      <div className="container">
      <div className="editor">
        <ul className="format-options">
          <li>T</li>
          <li className="roboto-font"><strong>B</strong></li>
          <li><em>I</em></li>
          <li><ins>S</ins></li>
          <li>&lt; &gt;</li>
        </ul>
        <hr/>
        <Editor/>
      </div>
    </div>
    </div>
  );
}

