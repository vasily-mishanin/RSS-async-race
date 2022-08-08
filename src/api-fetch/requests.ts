import Car, { Winner } from '../model/Car';

const endpoint = 'http://127.0.0.1:3000';

//GARAGE

export function getCars(_page?: number, _limit?: number) {
  return fetch(`${endpoint}/garage`, {
    method: 'GET',
  });
}

export function getCar(id: number) {
  return fetch(`${endpoint}/garage/${id}`, {
    method: 'GET',
  });
}

export function createCar(name: string, color: string) {
  return fetch(`${endpoint}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.length > 0 ? name : 'Mad Max',
      color,
    }),
  });
}

export function updateCar(car: Car) {
  return fetch(`${endpoint}/garage/${car.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: car.name, color: car.color }),
  });
}

export function deleteCar(id: number) {
  return fetch(`${endpoint}/garage/${id}`, {
    method: 'DELETE',
  });
}

export function startCarEngine(id: string) {
  return fetch(`${endpoint}/engine?id=${id}&&status=${'started'}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function stopCarEngine(id: string) {
  return fetch(`${endpoint}/engine?id=${id}&&status=${'stopped'}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function startDrive(id: string) {
  return fetch(`${endpoint}/engine?id=${id}&&status=${'drive'}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

//WINNERS

export function getWinners(_page?: number, _limit?: number, _sort?: 'id' | 'wins' | 'time', _order?: 'ASC' | 'DESC') {
  return fetch(`${endpoint}/winners?_page=${_page}&_limit=${_limit}&_sort=${_sort}&_order=${_order}`);
}

export function getWinner(id: number) {
  return fetch(`${endpoint}/winners/${id}`);
}

export function createWinner(winner: Winner) {
  return fetch(`${endpoint}/winners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(winner),
  });
}

export function deleteWinner(id: number) {
  return fetch(`${endpoint}/winners/${id}`, {
    method: 'DELETE',
  });
}

export function updateWinner(winner: Winner) {
  return fetch(`${endpoint}/winners/${winner.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wins: winner.wins, time: winner.time }),
  });
}
