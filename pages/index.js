import Head from 'next/head'
import styles from '../styles/Home.module.css'
import styled from 'styled-components'

import CoinGecko from 'coingecko-api';

const coinG = new CoinGecko();

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER_MARKET_CAP_DESC
  }
  const result = await coinG.coins.markets({params});
  return {
    props: {
      result
    }
  };
}

export default function Home(props) {
  const { data } = props.result;

  console.log(data);

  const HoverText = styled.p`
	color: #000;
	:hover {
		color: #ed1212;
		cursor: pointer;
	}
`


  const isPos = (number) => {
    if (number >= 0) {
      return true;
    } else {
      return false;
    }
  }

  const formatPercent = number => 
  `${new Number(number).toFixed(2)}%`

  const turnToUSD = (number, sigfigs) =>
    new Intl.NumberFormat('en-US', 
      { 
        style: 'currency', 
        currency: 'USD',
        sigfigs
      })
      .format(number);

  const numberwithCommas = number =>
    `${new Number(number).toLocaleString()}`

  return (
    <div className={styles.container}>
            <Head>
        <title>tracker</title>
      </Head>

      <h1 className = {styles.header}>Real-Time Cryptocurrency Prices</h1>
      
      <table className = {styles.coins}>
        <thead className = {styles.thead}>
          <tr>
            <th style = {{textAlign: "left", paddingLeft: 50}}>Coin</th>
            <th style = {{textAlign:"left"}}>Name</th>
            <th style = {{textAlign: "right"}}>Price</th>
            <th>24 Hour Change</th>
            <th>Today's High</th>
            <th>Today's Low</th>
            <th>Market Cap</th>
            <th>Circulating Supply</th>
            <th>Total Volume</th>
          </tr>
        </thead>
        
        <tbody style = {{paddingBottom: 50}}>
          {data.map(coin => (
            <tr key={coin.id}>
              <td style = {{textAlign: "left", paddingLeft: 20}}><img  src={coin.image} style={{width: 25, height: 25, marginRight: 10}}/> {coin.symbol.toUpperCase()} </td>
              <td style = {{textAlign: "left"}}>{coin.name}</td>
              <td style = {{textAlign: "right"}}>{turnToUSD(coin.current_price, 20)}</td>
              <td style= {{color: isPos(coin.price_change_percentage_24h) ? 'green' : 'red'}}>{formatPercent(coin.price_change_percentage_24h)}</td>
              <td style = {{textAlign: "right"}}>{turnToUSD(coin.high_24h)}</td>
              <td style = {{textAlign: "right"}}>{turnToUSD(coin.low_24h)}</td>
              <td style = {{textAlign: "right"}}>{turnToUSD(coin.market_cap, 8)}</td>
              <td style = {{textAlign: "right"}}>{numberwithCommas(coin.circulating_supply) + " " + coin.symbol.toUpperCase()}</td>
              <td style = {{textAlign: "right"}}>{numberwithCommas(coin.total_volume) + " " + coin.symbol.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    
  )
}

