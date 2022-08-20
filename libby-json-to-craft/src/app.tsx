import * as React from "react"
import * as ReactDOM from 'react-dom'
import { useRef } from 'react'
// import craftXIconSrc from "./craftx-icon.png"

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();
  const fileContainer = useRef(null); // Add a way to select the input DOM

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Create main app body, i.e. the form to submit the json file
  return <div id="main">
    <form id="upload" onSubmit={(event) => { // Inlining the submission function here because I'm not sure how to handle TypeScript's static typing.
      /** 
       * Handle submit events
       * @param {Event} event The event object
       */
      // Stop the form from reloading the page
      event.preventDefault();

      let file = fileContainer.current; // Assigns the input DOM to the file variable
      
      // If there's no file, do nothing
      if (file == null) return;
      
      // Create a new FileReader() object
      let reader = new FileReader();

      if (file != null) { // Workaround TypeScript error that warns file variable might be null
        // Setup the callback event to run when the file is read
        reader.onload = (e) => {
          if (e.target != null) { // Workaround TypeScript error that warns e.target might be null
            let str = e.target.result as string; // Types e.target.result as a string, else TS will throw an error
            let json = JSON.parse(str);
            console.log(json);

            // Store highlights arr in a variable so that it's easier to work with
            let highlightsArr = json.highlights;
            
            let quotes = [];
            // Iterate through highlights array to extract the quotes, then store in a new quotes array
            for (let i = 0; i < highlightsArr.length; i++) {
              quotes.push(highlightsArr[i].quote);
            }
            console.log(quotes);
          }
        };
        
        // Read the file
        reader.readAsText(file['files'][0]);
      }
    }}>
      <label htmlFor="file">Libby json file to upload</label>
      <input type="file" id="file" accept=".json" ref={fileContainer}></input>
      <button id="upload-button">Upload</button>
    </form>
  </div>;
}

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener(env => setIsDarkMode(env.colorScheme === "dark"));
  }, []);

  return isDarkMode;
}

/**
 * Log the uploaded file to the console
 * @param {event} Event The file loaded event
 */
// function logFile(event: React.SyntheticEvent<HTMLFormElement>) {
//   let str = event.target.result;
// 	let json = JSON.parse(str);
//   console.log('string', str);
// 	console.log('json', json);
// }

// function insertHelloWorld() {
//   const block = craft.blockFactory.textBlock({
//     content: "Hello world!"
//   });

//   craft.dataApi.addBlocks([block]);
// }

// I'm getting confused by the typing that's required of TypeScript. I shall try inlining the handler instead.
// function handleSubmit(e: React.FormEventHandler<HTMLInputElement) {
//   const event = e.target.value;
//   console.log(event);
// }

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'))
}
