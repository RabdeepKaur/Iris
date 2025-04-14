import React,{useEffect,useState} from 'react';
import axios from 'axios'; // fetching data from the server 
//GET is used to retiver data fromt he server which is represt in the form of URL 
//post is used to send data to the server to update this is sendin req body 

const endpoint = 'https://acm.savaal.xyz/leaderboard'



const get_leaderboard_data=()=>{
    return new Promise((resolve,reject)=>{
        axios.get(endpoint)
        .then((resposne)=>{
            resolve(respsone.data)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

const Leaderboard=(props)=>{
    //create a state to repesent the data 
    const[score,setScore]=useState()
    const[loading,setLoading]  =useState(true);
    const[error,setError]=useState(null);

    const fetchLeaderboard=()=>{
        setLoading(true);
        get_leaderboard_data()
        .then((data)=>{
            const playerScoreObject={};

            data.forEach((score)=>{
                if(!playerScoreObject.hasOwnProperty(playername)){
                    playerScoreObject[playername]=0;
                }
                const cleanScore = parseInt(score.points) || 0;
          playerScoreObject[playerName] += cleanScore;
            });
            const scoresArray=[];
            for(const key in playerScoreObject){
                scoreArray.push({
                    player:Key,
                    score:playerScoreObject[key],
                });
            }
            scoreArray.sort((first,second)=>second.score-first.score);

            setScore(scoreArray);
            setLoading(false);
        })
        .catch((error)=>{
            console.error("falied to fetch leaderboard data",error);
            setError(error);
            setLoaing(false);
            setScres([])
        })

            }   
        
            useEffect(()=>{
                fetchLeaderboard();
                const intervalId=setInterval(()=>{
                    fetchLeaderbaord();
                },10000);
                return ()=> clearInterval(intervalId);
            },[]);
            if(loading && scores.length===0){
                return(
                    <div className="scores">
                        <h1>Loading...</h1>
                    </div>
                );
            }
            if(error){
                return(
                    <div className="scores">
                        <h1>Error loading leaderboard</h1>
                    </div>
                );
            }
            const getRowClassName=(index)=>{
                if(index===0) return "first-place";
                if(index===1) return "second-place";
                if(index===2) return "third-place";
                return "normal-place";
            }
        
    
/*
// we have already mounted the data we nneed tot ge the data 
useEffect(()=>{
    get_leaderboard_data()
    .then((data)=>{
        // map the fetch data 
        var player_score_object={}
        data.map((score)=>{
            if(!player_score_object.hasOwnProperty(score.player))
            {
                player_score_object[score.player]=0;
            }
            var clean_score=parseint(score.points)
            player_score.onject[score.contributer]+=clean_score
            return null
        })
        var scores_array[]
        for(var key in player_score_object){
            score_arry.push({
                player:key,
                score: player_score_object[key],
            })
        }
        scores_array.sort((first,second)=>first.score<second.score)
        setScores(scores_array)
    })
.catch((error)=>{
    console.log(error)
    setScores([])
})
},[])*/


return (
    <div className="leaderboard-container">
      <h1>Game Leaderboard</h1>
      <p className="update-status">Live updates every 10 seconds</p>
      
      {/* Optional refresh button */}
      <button onClick={fetchLeaderboard} className="refresh-button">
        Refresh Now
      </button>
      
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <tr key={index} className={getRowClassName(index)}>
                <td>{index + 1}</td>
                <td>{score.player}</td>
                <td>{score.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">No players found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

}
export default leaderboard;
