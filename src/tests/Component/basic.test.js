import { Component } from '../../LIGHTER';

describe('Basic Component tests', () => {
  it('should create a basic text div', () => {
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
    console.log('comp', comp);
    expect(comp.listenersToAdd).toEqual([]);
    // drawing = false
    // discarding = false
    // router = null
    // id = isUUID
    // props.id = isUUID
    // props.text = testText
  });
});
