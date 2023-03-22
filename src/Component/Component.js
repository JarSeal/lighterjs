import { v4 as uuidv4 } from 'uuid';

class Component {
  constructor(props) {
    const id = uuidv4();
    console.log('ID', id);
  }
}

export default Component;
