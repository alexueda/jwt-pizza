import { sleep, check } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  const vars = {}

  response = http.put(
    'https://pizza-service.sharenote.link/api/auth',
    '{"email":"e@jwt.com","password":"e"}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.8',
        'content-type': 'application/json',
        origin: 'https://pizza.sharenote.link',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
      },
    }
  )
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  vars['token'] = jsonpath.query(response.json(), '$.token')[0]

  sleep(2.9)

  response = http.get('https://pizza-service.sharenote.link/api/order/menu', {
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.8',
      authorization: `Bearer ${vars['token']}`,
      'content-type': 'application/json',
      'if-none-match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
      origin: 'https://pizza.sharenote.link',
      priority: 'u=1, i',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-gpc': '1',
    },
  })

  response = http.get('https://pizza-service.sharenote.link/api/franchise', {
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.8',
      authorization: `Bearer ${vars['token']}`,
      'content-type': 'application/json',
      'if-none-match': 'W/"81-DoaJIYMQaKdFk1CZ17J8NKKO2dA"',
      origin: 'https://pizza.sharenote.link',
      priority: 'u=1, i',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-gpc': '1',
    },
  })
  sleep(7.2)

  response = http.post(
    'https://pizza-service.sharenote.link/api/order',
    '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":3}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.8',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.sharenote.link',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
      },
    }
  )
  sleep(1.9)

  response = http.post(
    'https://pizza-factory.cs329.click/api/order/verify',
    '{"jwt":"eyJpYXQiOjE3NDM1NTU1NTcsImV4cCI6MTc0MzY0MTk1NywiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJhbGV4dWVkYSIsIm5hbWUiOiJBbGV4YW5kZXIgVWVkYSJ9LCJkaW5lciI6eyJpZCI6NSwibmFtZSI6ImUiLCJlbWFpbCI6ImVAand0LmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoxLCJkZXNjcmlwdGlvbiI6IlZlZ2dpZSIsInByaWNlIjowLjAwMzh9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MywiaWQiOjJ9fQ.k7zwOpLqyCrHKwHmee_ZFhT66dPlXXqAuMihey4c758PX3v-A3l2LJgj_F_swiuY1QgmqJhKpmdstnuv-uv4dk6-ldjD9I8JjkcPQ4c5gm_rsR8nFoL7hyAsZcQ-6tId6lQsRpr_GJ86Fd3iubv3Gr6yHx8hwzTmszuuF4ZPJK058MesL_RqakNZoWoWUuim2ikP1C36gK7rRzx9eeQXiE1G41ac7vx_jVkM5DZ1FSr7Z8gq7k9xWtEKbvEvQiR5LPNrAkKpTWw8DJ6BIAa6cSoizDqHSj2OuTMORwK4gZhanIJdXBKoRScKc9qkPIOFN9vIy9H4fGVSQXk05ePQLHQlys8WWhvs_ij4k0l7hNJkEFKytgWtMBWZTHZNDw2AYZEApWeMhHg73ZVib-pAcKULJm--p8FM5Na2e5l94rac29FJ2dGGyMIu8mZDgg5Qxr5KjVq6RzYrC9cOoN2e-8PM3YCare_12i-_Nk_ZznVI_DqYJPwrxXJymoxqx98UQQKXZIcdzJDaG_PE_Lx4JSKxo_rK3WiNuOmlBGKfZ5knvSenBGfeVwwklZpddhYMe7QoJSoMROjhoIK6eYVr1a5_e4GzgPpCmzqG0N5sFam_GmM7hG8HqYPx7G4L3nVu9F5C35CXdPkRkxvM-PTRcGLnmwvTls1ggA_5YWEhfE0"}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.8',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.sharenote.link',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-storage-access': 'none',
        'sec-gpc': '1',
      },
    }
  )
}
