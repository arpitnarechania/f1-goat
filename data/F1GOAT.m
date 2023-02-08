close all
clear
clc
driverstats = readtable('driver.csv','Encoding','UTF-8');
byyear = zeros(height(driverstats),length(1977:2018));
for year = 1977:2018
       byyear(:,year-1976) = f1alg(year);
end
xlswrite('./output/F1GOAT.xlsx',byyear,'By Year','B2')
xlswrite('./output/F1GOAT.xlsx',1977:2018,'By Year','B1')
xlswrite('./output/F1GOAT.xlsx',driverstats{:,{'Var2'}},'By Year','A2')

byera = zeros(height(driverstats),9);
byera(:,1) = f1alg(1977:1981);
byera(:,2) = f1alg(1982:1987);
byera(:,3) = f1alg(1988:1992);
byera(:,4) = f1alg(1993);%?
byera(:,5) = f1alg(1994:1998);
byera(:,6) = f1alg(1999:2003);
byera(:,7) = f1alg(2004:2007);
byera(:,8) = f1alg(2008:2012);
byera(:,9) = f1alg(2013:2018);
eras = {'1977-1981','1982-1987','1988-1992','1993','1994-1998',...
    '1999-2003','2004-2007','2008-2012','2013-2018'};
xlswrite('./output/F1GOAT.xlsx',byera,'By Era','B2')
xlswrite('./output/F1GOAT.xlsx',eras,'By Era','B1')
xlswrite('./output/F1GOAT.xlsx',driverstats{:,{'Var2'}},'By Era','A2')

xlswrite('./output/F1GOAT.xlsx',f1alg(1977:2018),'All Time','B2')
xlswrite('./output/F1GOAT.xlsx',{'1977-'},'All Time','B1')
xlswrite('./output/F1GOAT.xlsx',driverstats{:,{'Var2'}},'All Time','A2')