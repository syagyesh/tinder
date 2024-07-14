"use client";
import * as React from 'react';
import { Neo4jUser } from '../../../types';
import TinderCard from 'react-tinder-card'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { neo4jSwipe } from '../neo4j.action';

type HomeProps = {
  currentUser: Neo4jUser;
  users: Neo4jUser[];
}

const HomeComponent: React.FC<HomeProps> = ({ currentUser, users }) => {

  const handleSwipe = async (direction: string, id: string) => {
    const isMatch = await neo4jSwipe(currentUser.id, id, direction);
    if (isMatch) {
      alert('Match!');
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center item-center align-center'>
      <div>
        <div>
          <h1 className='text-4xl font-bold'>
            Welcome {currentUser.firstName} {currentUser.lastName}
          </h1>
        </div>
        <div className='mt-4 relative'>
          {users.map((user) => <TinderCard key={user.id} onSwipe={(direction) => handleSwipe(direction, user.id)} className='absolute'>
            <Card>
              <CardHeader>
                <CardTitle>
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription>
                  {user.email}
                </CardDescription>
              </CardHeader>
            </Card>
          </TinderCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeComponent;