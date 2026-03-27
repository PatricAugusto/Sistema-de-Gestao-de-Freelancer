import styled from 'styled-components';

export const Container = styled.main`
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem;
  font-family: monospace;
  color: black;
`;

export const Header = styled.header`
  margin-bottom: 3rem;
  transform: rotate(-1deg);
  background-color: #F4E04D; 
  border: 4px solid black;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
  display: inline-block;

  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -2px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

export const Card = styled.div`
  background: white;
  border: 4px solid black;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
  transition: all 0.2s;
  transform: ${props => props.rotate || '0deg'};

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
  }

  h2 {
    font-weight: bold;
    text-transform: uppercase;
  }

  .value {
    font-size: 2rem;
    font-weight: 900;
  }
`;

export const IconBox = styled.div`
  background: ${props => props.bg || '#ccc'};
  border: 2px solid black;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: ${props => props.color || 'black'};
`;

export const TableContainer = styled.section`
  background: white;
  border: 4px solid black;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
  margin-top: 2rem;
  overflow-x: auto;

  h3 {
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    text-decoration: underline;
    text-decoration-color: #5E60CE;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: monospace;

  th {
    background: #000;
    color: #fff;
    text-align: left;
    padding: 1rem;
    text-transform: uppercase;
  }

  td {
    padding: 1rem;
    border-bottom: 2px solid black;
    font-weight: bold;
  }

  tr:hover td {
    background: #f9f9f9;
  }

  .status-badge {
    background: #4ade80;
    border: 2px solid black;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    box-shadow: 2px 2px 0px 0px #000;
  }
`;

export const TimerCard = styled.section`
  background: #000;
  color: #fff;
  border: 4px solid black;
  padding: 2rem;
  box-shadow: 8px 8px 0px 0px #F4E04D;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  .display {
    font-size: 4rem;
    font-weight: 900;
    font-family: 'Courier New', Courier, monospace;
    background: #333;
    padding: 0.5rem 2rem;
    border: 2px inset #555;
  }

  .controls {
    display: flex;
    gap: 1rem;
  }
`;

export const Button = styled.button`
  background: ${props => props.bg || '#fff'};
  color: #000;
  border: 3px solid #000;
  padding: 0.75rem 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #555;
  
  &:active {
    box-shadow: 0px 0px 0px 0px #555;
    transform: translate(4px, 4px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InputBrutal = styled.input`
  border: 3px solid black;
  padding: 0.5rem;
  font-family: monospace;
  font-weight: bold;
  width: 100%;
  margin-bottom: 1rem;
`;

export const SelectBrutal = styled.select`
  width: 100%;
  border: 4px solid black;
  padding: 0.75rem;
  font-family: monospace;
  font-weight: 900;
  background: white;
  margin-bottom: 1.5rem;
  box-shadow: 4px 4px 0px 0px #000;
  cursor: pointer;
  appearance: none; 

  &:focus {
    outline: none;
    background: #F4E04D; 
  }
`;

export const Label = styled.label`
  display: block;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: flex-end;

  div {
    flex: 1;
    min-width: 200px;
  }
`;

export const FilterButton = styled.button`
  background: #000;
  color: #fff;
  border: 4px solid black;
  padding: 0.75rem 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #5E60CE;
  height: fit-content;

  &:hover {
    background: #5E60CE;
    box-shadow: 2px 2px 0px 0px #000;
  }
`;