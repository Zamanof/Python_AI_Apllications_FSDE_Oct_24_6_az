/** API dəyərləri dəyişmədən şəhər adlarını düzgün Azərbaycan dilində göstərir. */
export const cityNamesAZ: Record<string, string> = {
  Agjabadi: 'Ağcabədi',
  Astara: 'Astara',
  Balakan: 'Balakən',
  Baku: 'Bakı',
  Barda: 'Bərdə',
  Gabala: 'Qəbələ',
  Ganja: 'Gəncə',
  Goychay: 'Göyçay',
  Guba: 'Quba',
  Hajigabul: 'Hacıqabul',
  Ismayilli: 'İsmayıllı',
  Khachmaz: 'Xaçmaz',
  Kurdamir: 'Kürdəmir',
  Lankaran: 'Lənkəran',
  Lerik: 'Lerik',
  Masalli: 'Masallı',
  Mingachevir: 'Mingəçevir',
  Nakhchivan: 'Naxçıvan',
  Qakh: 'Qax',
  Qusar: 'Qusar',
  Salyan: 'Salyan',
  Shaki: 'Şəki',
  Shamakhi: 'Şamaxı',
  Siyazan: 'Siyəzən',
  Sumqayit: 'Sumqayıt',
  Yevlakh: 'Yevlax',
};

export function getCityNameAZ(value: string): string {
  return cityNamesAZ[value] ?? value;
}
