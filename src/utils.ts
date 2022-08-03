export type Maybe<T> = T | null

export type Dict<T> = { [key: string]: T }

export type PrintableInfo = {
  repository: string;
  pullRequest: string;
  status: string;
}

export const infoPrecendence: (keyof PrintableInfo)[] = ['repository', 'pullRequest', 'status']

export const infoLabels: PrintableInfo = {
  repository: 'Repository',
  pullRequest: 'Pull Request',
  status: 'Status',
}

export const printInfo = (info: PrintableInfo, message?: string) => {
  if (message) console.info(message)

  infoPrecendence.forEach(key => {
    if (info[key]) console.info(`${infoLabels[key]}: ${info[key]}`)
  })
}
