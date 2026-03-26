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