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