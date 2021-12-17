const styles = `
#game-content {
  display: flex;
  justify-content: space-between;
}

div.mid-screencontainer {
  flex-grow: 1;
  position: relative;
}

#world-box {
  width: min(calc(100vw - 684px), calc(100vh - 100px));
  height: min(calc(100vw - 684px), calc(100vh - 100px));
}

#bottom-box {
  position: absolute;
  bottom: 10px;
  left: 30px;
  right: 30px;
  opacity: 0.5;
}

#bottom-box:hover {
  opacity: 1;
}
`;

export default styles;