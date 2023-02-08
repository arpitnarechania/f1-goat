function[output]=f1alg(years_inc)
%years_inc must be an integer or an array of integers
%Attempt to use the fitlme function to approximate with linear
%mixed effects model
%Equation 2 from paper
vector_check = size(years_inc);
if(vector_check(2)<vector_check(1))
   years_inc = years_inc';
end
results = readtable('./raw/results.csv','Encoding','UTF-8');
driverstats = readtable('./raw/driver.csv','Encoding','UTF-8');
races = readtable('./raw/races.csv','Encoding','UTF-8');
teams = readtable('./raw/constructors.csv','Encoding','UTF-8');
idx_time = find(sum((races{:,{'Var2'}}==years_inc),2));
race_ids = races{idx_time,{'Var1'}};
for a = 1:height(results)
    results_idx(a) = sum(results{a,{'Var2'}}==race_ids)>0;
end
results_c = results(find(results_idx),:);
positionOrder_c = results_c{:,{'Var9'}};
positionOrder = results{:,{'Var9'}};
% y_pos = (positionOrder>6).*(.1.^(.2*positionOrder))+...
% (3<=positionOrder & 6>=positionOrder).*(-positionOrder+7)+(6*(positionOrder==2))+(10*(positionOrder==1));
% y = norminv((tiedrank(y_pos)-.5)/length(y_pos));
y = zeros(height(results_c),1);
n_drivers = zeros(height(results),1);
n_drivers_c = zeros(height(results_c),1);
n_driver_race_t = zeros(max(results{:,{'Var2'}}),1);
n_driver_race = zeros(max(results_c{:,{'Var2'}}),1);
comp_driver = zeros(height(driverstats),1);
comp = zeros(height(results_c),1);
for i = min(results_c{:,{'Var2'}}):max(results_c{:,{'Var2'}})
    n_driver_race(i-min(results_c{:,{'Var2'}})+1) = sum((results_c{:,{'Var2'}}==i));
    y(find(results_c{:,{'Var2'}}==i)) = norminv((positionOrder_c(find(results_c{:,{'Var2'}}==i))-.5)/(n_driver_race(i-min(results_c{:,{'Var2'}})+1)));
    n_drivers_c(find(results_c{:,{'Var2'}}==i)) = n_driver_race(i-min(results_c{:,{'Var2'}})+1);
end
for i_t = 1:max(results{:,{'Var2'}})
    n_driver_race_t(i_t) = sum((results{:,{'Var2'}}==i_t));
    n_drivers = n_drivers + (results{:,{'Var2'}}==i_t)*n_driver_race_t(i_t);
end
for j = 1:height(driverstats)
	driver_id = driverstats{j,{'Var1'}};
	num_races = sum(results{:,{'Var3'}} == driver_id);
	idx = find(results{:,{'Var3'}} == driver_id);
	places = positionOrder(idx);
	numdrivers = n_drivers(idx);
	comp_driver(driver_id) = sum(places./numdrivers)/num_races;
    driver_name{driver_id} = char(strcat(driverstats{j,{'Var5'}},{' '},driverstats{j,{'Var6'}}));
end
for k = min(results_c{:,{'Var2'}}):max(results_c{:,{'Var2'}})
    results_drivers = results_c{:,{'Var3'}};
	comp_race = sum(comp_driver(results_drivers(find(results_c{:,{'Var2'}}==k))))/n_driver_race(k-min(results_c{:,{'Var2'}})+1);
	comp(find(results_c{:,{'Var2'}}==k)) = comp_race;
end
for m = 1:height(races)
	year{races{m,{'Var1'}}} = char(strcat(int2str(races{m,{'Var2'}})));
end
for n = 1:height(teams)
	team_name{teams{n,{'Var1'}}} = char(strcat(teams{n,{'Var3'}}));
end
for nn = 1:height(results_c)
	res_id{nn} = char(strcat(int2str(results_c{nn,{'Var1'}})));
end
X = [ones(height(results_c),1) n_drivers_c comp];
if(rank(X) < length(X))
   X = [ones(height(results_c),1)+n_drivers_c comp];
   if(rank(X) < length(X))
       X = ones(height(results_c),1)+n_drivers_c+comp;
   end
end
Z{1} = ones(height(results_c),1);
Z{2} = ones(height(results_c),1);
Z{3} = ones(height(results_c),1);
Z{4} = ones(height(results_c),1);
G{1} = driver_name(results_c{:,{'Var3'}})';
G{2} = team_name(results_c{:,{'Var4'}})';
G{3} = strcat(team_name(results_c{:,{'Var4'}}),year(results_c{:,{'Var2'}}))';
G{4} = res_id';
lme = fitlmematrix(X,y,Z,G,'RandomEffectGroups',{'Driver','Team','TeamYear','Level1'},'RandomEffectPredictors',{{'Residual'},{'Residual'},{'Residual'},{'Residual'}});
[~,~,stats] = randomEffects(lme);
sortedstats = sortrows(stats(strcmp(stats.Group,'Driver'),{'Group','Level','Estimate'}),{'Estimate'},{'ascend'});
output = zeros(height(driverstats),1);
for d = 1:height(driverstats)
    if(length(find(strcmp(dataset2cell(sortedstats(:,{'Level'})),driver_name{driverstats{d,{'Var1'}}}))) == 1)
        output(d) = find(strcmp(dataset2cell(sortedstats(:,{'Level'})),driver_name{driverstats{d,{'Var1'}}})) - 1;
    end
end
end
