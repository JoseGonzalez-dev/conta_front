import { AccountType } from '../types';
import type { Account, CreateAccountRequest } from '../types';
import { get, post } from '../../../shared/utils/service/api';

const URI_BASE = '/accounting';

// Mapear respuesta del backend al formato del frontend
interface BackendAccount {
  id?: number;
  codigo: string;
  nombre: string;
  tipo_cuenta: string;
  cuenta_padre_id?: number;
  es_detalle: boolean;
  activa: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

// Mapear números del backend a tipos de cuenta del frontend
const mapAccountTypeFromBackend = (tipo: string | number): AccountType => {
  const tipoStr = String(tipo).trim();

  switch (tipoStr) {
    case '1':
      return AccountType.ACTIVO;
    case '2':
      return AccountType.PASIVO;
    case '3':
      return AccountType.PATRIMONIO;
    case '4':
      return AccountType.INGRESO;
    case '5':
      return AccountType.GASTO;
    default:
      return AccountType.ACTIVO; // Valor por defecto
  }
};

const mapBackendAccount = (backendAccount: BackendAccount): Account => {
  return {
    id: backendAccount.id || 0,
    code: backendAccount.codigo,
    name: backendAccount.nombre,
    type: mapAccountTypeFromBackend(backendAccount.tipo_cuenta),
    parentId: backendAccount.cuenta_padre_id,
    isDetail: backendAccount.es_detalle,
    isActive: backendAccount.activa,
    createdAt: backendAccount.creado_en ? new Date(backendAccount.creado_en) : undefined,
    updatedAt: backendAccount.actualizado_en ? new Date(backendAccount.actualizado_en) : undefined,
  };
};

class AccountsService {
  async getAll(): Promise<Account[]> {
    const backendAccounts = await get<BackendAccount[]>(`${URI_BASE}/cuentas`);
    return backendAccounts.map(mapBackendAccount);
  }

  async create(accountData: CreateAccountRequest): Promise<Account> {
    const payload: BackendAccount = {
      codigo: accountData.code,
      nombre: accountData.name,
      tipo_cuenta: accountData.type,
      cuenta_padre_id: accountData.parentId,
      es_detalle: accountData.isDetail,
      activa: accountData.isActive,
    };
    const createdBackendAccount = await post<BackendAccount, BackendAccount>(`${URI_BASE}/cuentas`, payload);
    return mapBackendAccount(createdBackendAccount);
  }
}

export const accountsService = new AccountsService();