export function checkStation(s){
  const issues = [];

  if (s.lan_speed < 1000) issues.push("LAN NOK");
  if (s.suhu >= 80) issues.push("CPU NOK");

  return issues;
}