import React from 'react';

const Spacer = ({ width, height, maxWidth, maxHeight}: React.CSSProperties) => {
	return <div style={{ width, height, maxWidth, maxHeight}} />
}

export default Spacer;