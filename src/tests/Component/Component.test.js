import {
  Component,
  isComponentLoggerQuiet,
  getComponentById,
  getComponentElemById,
} from '../../LIGHTER';
import { createEmptyRootDiv, isUUID } from '../testUtils';

describe('Component class tests', () => {
  beforeAll(() => {
    isComponentLoggerQuiet(true);
    createEmptyRootDiv();
  });

  it('should fail component creation when trying to use invalid props', () => {
    let error = '';
    try {
      new Component({ children: [] });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Invalid Component props key.');

    error = '';
    try {
      new Component({ parent: {} });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Invalid Component props key.');
  });

  it('should fail component creation when trying to use the same id twice', () => {
    new Component({ id: 'myid' });

    let error = '';
    try {
      new Component({ id: 'myid' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Duplicate component id.');
  });

  it('should not draw when drawing and discarding are in progress', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.drawing = true;
    appRoot.draw({ text: 'test 2' });
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.drawing = false;
    appRoot.discarding = true;
    appRoot.draw({ text: 'test 3' });
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.discarding = false;
    appRoot.draw({ text: 'testing' });
    expect(document.getElementById('appRoot').textContent).toEqual('testing');

    appRoot.discard(true);
  });

  it('should fail when trying to draw a component without a parent or attachId', () => {
    const comp = new Component();
    let error = '';
    try {
      comp.draw();
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');
  });

  it('should create a basic text div and check the component class types and default values', () => {
    const testText = 'Test text';
    const comp = new Component({ text: testText });
    expect(typeof comp.draw).toBe('function');
    expect(typeof comp.add).toBe('function');
    expect(typeof comp.addListener).toBe('function');
    expect(typeof comp.removeListener).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.getComponentById).toBe('function');
    expect(typeof comp.getComponentElemById).toBe('function');
    expect(typeof comp._setElemData).toBe('function');
    expect(typeof comp._createDefaultTemplate).toBe('function');
    expect(typeof comp._checkParentAndAttachId).toBe('function');
    expect(comp.isComponent).toBeTruthy();
    expect(comp.children).toEqual({});
    expect(comp.listeners).toEqual({});
    expect(comp.listenersToAdd).toEqual([]);
    expect(comp.drawing).toBeFalsy();
    expect(comp.discarding).toBeFalsy();
    expect(comp.router).toEqual(null);
    expect(isUUID(comp.id)).toBeTruthy();
    expect(isUUID(comp.props.id)).toBeTruthy();
    expect(comp.props.text).toEqual(testText);
  });

  it('should fail when registering a listener without type or fn', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const button = appRoot.add({ tag: 'button', text: 'Click me' });

    let error = '';
    try {
      button.addListener({ type: 'click' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');

    error = '';
    try {
      button.addListener({ fn: 'click' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');

    appRoot.discard(true);
  });

  it('should fail when trying to remove an unknown listener', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const button = appRoot.add({ tag: 'button', text: 'Click me', preCreateElement: true });
    button.addListener({ type: 'click', fn: () => {} });
    let error = '';
    try {
      button.removeListener('unknownId');
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual("Cannot read properties of undefined (reading 'target')");

    appRoot.discard(true);
  });

  // Test discard and full discard
  it('should discard and full discard created components (and its possible children)', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const div = appRoot.add({ _id: 'my-div' }).draw();
    const discardDiv = div.add({ _id: 'discard-div' }).draw();

    expect(Boolean(document.getElementById('appRoot'))).toBeTruthy();
    expect(Boolean(document.getElementById('my-div'))).toBeTruthy();
    expect(Boolean(document.getElementById('discard-div'))).toBeTruthy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();

    // Soft and hard discard for a single component
    discardDiv.discard();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();
    discardDiv.draw();
    discardDiv.discard(true);
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('discard-div')?.isComponent).toBeFalsy();

    // Since the discardDiv is still in this components memory,
    // it can be redrawn (garbage collector finishes the job afterwards).
    // Drawing it again, will add it to the component's list.
    discardDiv.draw();

    // Soft discard of a component with children
    div.discard();

    expect(Boolean(document.getElementById('my-div'))).toBeFalsy();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('my-div').isComponent).toBeTruthy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();

    div.draw();
    discardDiv.draw();
    expect(Boolean(document.getElementById('discard-div'))).toBeTruthy();

    // Hard discard of a component with children
    div.discard(true);

    expect(Boolean(document.getElementById('my-div'))).toBeFalsy();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('my-div')).toBeFalsy();
    expect(getComponentById('discard-div')).toBeFalsy();

    appRoot.discard(true);
    expect(document.getElementById('root').children.length).toEqual(0);
  });

  // Test getComponentById
  it('should get component class by its ID', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const appRootComponent = getComponentById('appRoot');

    expect(getComponentById('appRoot')).toEqual(appRootComponent);
    expect(getComponentById('someNoneExistingId')).toEqual(undefined);

    appRoot.discard(true);
  });

  // Test getComponentElemById
  it('should get component element by its ID', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const appRootElem = getComponentElemById('appRoot');

    expect(appRootElem).toEqual(appRoot.elem);

    appRoot.discard(true);
  });
});
