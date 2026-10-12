import type {Topic} from './curriculum';
export const HIGH_SCHOOL_TOPICS:Topic[]=[
  {
    "id": "9-expressions",
    "grade": 9,
    "title": "Simplifying expressions",
    "category": "Algebra 1",
    "color": "mint",
    "minutes": 10,
    "description": "Combine matching terms to make an expression easier to read.",
    "idea": "Terms are pieces separated by addition or subtraction. You can combine terms only when their variable parts match.",
    "rules": [
      "Identify each term and its sign.",
      "Group terms with the same variables and powers.",
      "Add their coefficients and keep the variable part."
    ],
    "mistake": "4x + 3 is not 7x: a variable term and a constant are not like terms.",
    "visual": "distribute",
    "standard": "Introductory practice"
  },
  {
    "id": "9-equations",
    "grade": 9,
    "title": "Multi-step linear equations",
    "category": "Algebra 1",
    "color": "blue",
    "minutes": 10,
    "description": "Find the value that makes both sides equal.",
    "idea": "An equation works like a balanced scale. Applying the same operation to both sides keeps the balance.",
    "rules": [
      "Distribute and combine like terms first.",
      "Use equal operations on both sides to isolate the variable.",
      "Substitute your answer into the original equation."
    ],
    "mistake": "Changing only one side breaks the equality.",
    "visual": "balance",
    "standard": "Introductory practice"
  },
  {
    "id": "9-inequalities",
    "grade": 9,
    "title": "Linear inequalities",
    "category": "Algebra 1",
    "color": "peach",
    "minutes": 10,
    "description": "Describe all values that make a comparison true.",
    "idea": "An inequality usually has a set of solutions rather than one answer. Multiplying or dividing both sides by a negative reverses their order.",
    "rules": [
      "Isolate the variable using operations on both sides.",
      "Reverse the comparison when multiplying or dividing by a negative.",
      "Check a value in the proposed solution set."
    ],
    "mistake": "Dividing by a negative without reversing the inequality gives the wrong side of the number line.",
    "visual": "numberline",
    "standard": "Introductory practice"
  },
  {
    "id": "9-functions",
    "grade": 9,
    "title": "Function notation",
    "category": "Algebra 1",
    "color": "yellow",
    "minutes": 10,
    "description": "Use a function rule to turn an input into an output.",
    "idea": "A function assigns exactly one output to each allowed input. The notation f(x) names that output.",
    "rules": [
      "Identify the given input.",
      "Replace every x in the rule with that input.",
      "Follow the order of operations to find the output."
    ],
    "mistake": "f(x) is function notation, not f multiplied by x.",
    "visual": "machine",
    "standard": "Introductory practice"
  },
  {
    "id": "9-slope",
    "grade": 9,
    "title": "Slope and rate of change",
    "category": "Algebra 1",
    "color": "lavender",
    "minutes": 10,
    "description": "Measure how much y changes for each unit change in x.",
    "idea": "Slope compares vertical change with horizontal change. A positive slope rises from left to right, while a negative slope falls.",
    "rules": [
      "Choose the same order for both points.",
      "Find the change in y and the change in x.",
      "Divide change in y by change in x."
    ],
    "mistake": "Reversing only one subtraction changes the sign incorrectly; a vertical line has undefined slope.",
    "visual": "slope",
    "standard": "Introductory practice"
  },
  {
    "id": "9-lines",
    "grade": 9,
    "title": "Slope-intercept form",
    "category": "Algebra 1",
    "color": "mint",
    "minutes": 10,
    "description": "Read and use the equation y = mx + b.",
    "idea": "The slope m tells how fast y changes. The intercept b is the y-value when x is zero.",
    "rules": [
      "Identify the slope m and intercept b.",
      "Write or read the rule y = mx + b.",
      "Substitute an x-value to find its matching y-value."
    ],
    "mistake": "The y-intercept is a starting output, not the slope or the x-intercept.",
    "visual": "slope",
    "standard": "Introductory practice"
  },
  {
    "id": "9-systems",
    "grade": 9,
    "title": "Systems of linear equations",
    "category": "Algebra 1",
    "color": "blue",
    "minutes": 10,
    "description": "Find a point that satisfies two equations at once.",
    "idea": "Each linear equation describes a line. Their intersection gives a solution shared by both equations.",
    "rules": [
      "Use substitution or elimination to find one variable.",
      "Find the second variable using an original equation.",
      "Check both original equations."
    ],
    "mistake": "A point on only one of the lines is not a solution to the system.",
    "visual": "system",
    "standard": "Introductory practice"
  },
  {
    "id": "9-exponents",
    "grade": 9,
    "title": "Exponents and radicals",
    "category": "Algebra 1",
    "color": "peach",
    "minutes": 10,
    "description": "Connect powers with roots and evaluate numerical expressions.",
    "idea": "An exponent can describe repeated multiplication or a root. A square root asks for a number whose square gives the original value.",
    "rules": [
      "Rewrite fractional exponents as roots when helpful.",
      "Evaluate powers and roots before adding or subtracting.",
      "Use the nonnegative principal value for a square-root symbol."
    ],
    "mistake": "The symbol √16 equals 4, while the equation x² = 16 has the two solutions 4 and -4.",
    "visual": "squares",
    "standard": "Introductory practice"
  },
  {
    "id": "9-polynomials",
    "grade": 9,
    "title": "Polynomial operations",
    "category": "Algebra 1",
    "color": "yellow",
    "minutes": 10,
    "description": "Add, subtract and multiply expressions with several terms.",
    "idea": "Polynomial operations build on the same arithmetic rules you already know. Distribution ensures every required product is included.",
    "rules": [
      "Distribute each term across the other factor.",
      "Track signs and powers carefully.",
      "Combine like terms after expanding."
    ],
    "mistake": "Multiplying only the first terms and last terms misses the two middle products.",
    "visual": "polynomial",
    "standard": "Introductory practice"
  },
  {
    "id": "9-factoring",
    "grade": 9,
    "title": "Factoring quadratics",
    "category": "Algebra 1",
    "color": "lavender",
    "minutes": 10,
    "description": "Rewrite a quadratic expression as multiplied factors.",
    "idea": "Factoring reverses multiplication. For x² + bx + c, two suitable numbers add to b and multiply to c.",
    "rules": [
      "Look for a common factor first.",
      "Find numbers that satisfy the needed sum and product.",
      "Multiply your factors to check the result."
    ],
    "mistake": "Finding a pair with the correct product is not enough; the sum must also match.",
    "visual": "polynomial",
    "standard": "Introductory practice"
  },
  {
    "id": "9-quadratics",
    "grade": 9,
    "title": "Quadratic equations",
    "category": "Algebra 1",
    "color": "mint",
    "minutes": 10,
    "description": "Use factors to locate solutions of a quadratic equation.",
    "idea": "When a product is zero, at least one factor must be zero. A quadratic equation can have two, one or no real solutions.",
    "rules": [
      "Set one side of the equation equal to zero.",
      "Factor when possible and set each factor equal to zero.",
      "List and check every solution requested."
    ],
    "mistake": "Finding one root does not mean you have found every root.",
    "visual": "parabola",
    "standard": "Introductory practice"
  },
  {
    "id": "9-exponential",
    "grade": 9,
    "title": "Exponential growth and decay",
    "category": "Algebra 1",
    "color": "blue",
    "minutes": 10,
    "description": "Model a quantity that changes by a repeated factor.",
    "idea": "An exponential pattern multiplies by the same factor over equal time steps. Its starting value occurs at time zero.",
    "rules": [
      "Identify the starting quantity.",
      "Identify the factor for each equal time step.",
      "Multiply the start by the factor raised to the number of steps."
    ],
    "mistake": "Adding the same amount each time is linear, while multiplying by the same factor is exponential.",
    "visual": "exponential",
    "standard": "Introductory practice"
  },
  {
    "id": "10-transformations",
    "grade": 10,
    "title": "Function transformations",
    "category": "Algebra 2",
    "color": "mint",
    "minutes": 10,
    "description": "Understand how a familiar graph moves or changes size.",
    "idea": "A transformed function keeps a recognizable relationship to a parent function. Changes inside the input and outside the output affect the graph in different ways.",
    "rules": [
      "Identify the parent function.",
      "Read horizontal changes inside the input and vertical changes outside.",
      "Check a key point such as the vertex."
    ],
    "mistake": "In (x - h)², subtracting h inside shifts the graph right by h.",
    "visual": "parabola",
    "standard": "Introductory practice"
  },
  {
    "id": "10-composition",
    "grade": 10,
    "title": "Function composition",
    "category": "Algebra 2",
    "color": "blue",
    "minutes": 10,
    "description": "Use one function's output as another function's input.",
    "idea": "Composition connects two function rules in a chosen order. The inside function runs first, then its output enters the outside function.",
    "rules": [
      "Start with the function inside the parentheses.",
      "Use its output as the next input.",
      "Check that each input is allowed."
    ],
    "mistake": "f(g(x)) does not mean f(x) times g(x), and reversing the order can change the answer.",
    "visual": "machine",
    "standard": "Introductory practice"
  },
  {
    "id": "10-inverses",
    "grade": 10,
    "title": "Inverse functions",
    "category": "Algebra 2",
    "color": "peach",
    "minutes": 10,
    "description": "Recover an input from a known output.",
    "idea": "An inverse function reverses the original input-output relationship. The original function must be one-to-one on the domain being used.",
    "rules": [
      "Set the original output equal to the given value.",
      "Undo the original operations in reverse order.",
      "Check that the recovered input produces the given output."
    ],
    "mistake": "The notation f⁻¹ names an inverse function, not the reciprocal 1/f.",
    "visual": "machine",
    "standard": "Introductory practice"
  },
  {
    "id": "10-completing-square",
    "grade": 10,
    "title": "Completing the square",
    "category": "Algebra 2",
    "color": "yellow",
    "minutes": 10,
    "description": "Rewrite a quadratic to reveal its vertex.",
    "idea": "A perfect-square expression has the form (x + a)². Completing the square creates this form while keeping the original expression equal.",
    "rules": [
      "For a monic quadratic, take half the coefficient of x.",
      "Square that half to form the needed perfect square.",
      "Balance any added amount to preserve equivalence."
    ],
    "mistake": "Adding a number to an expression without compensating changes its value.",
    "visual": "polynomial",
    "standard": "Introductory practice"
  },
  {
    "id": "10-complex",
    "grade": 10,
    "title": "Complex numbers",
    "category": "Algebra 2",
    "color": "lavender",
    "minutes": 10,
    "description": "Use i to extend arithmetic beyond real square roots.",
    "idea": "The imaginary unit i is defined by i² = -1. A complex number combines a real part and an imaginary part.",
    "rules": [
      "Multiply or distribute using ordinary algebra rules.",
      "Replace every i² with -1.",
      "Combine real terms and imaginary terms separately."
    ],
    "mistake": "i² equals -1, but i itself is not -1.",
    "visual": "complex",
    "standard": "Introductory practice"
  },
  {
    "id": "10-division",
    "grade": 10,
    "title": "Polynomial division",
    "category": "Algebra 2",
    "color": "mint",
    "minutes": 10,
    "description": "Find a quotient and account for any remainder.",
    "idea": "Polynomial division reverses polynomial multiplication. The dividend equals the divisor times the quotient plus the remainder.",
    "rules": [
      "Arrange terms by descending powers.",
      "Divide, multiply and subtract until the remainder has lower degree.",
      "Check using divisor × quotient + remainder."
    ],
    "mistake": "A remainder cannot be dropped when rewriting a rational expression.",
    "visual": "polynomial",
    "standard": "Introductory practice"
  },
  {
    "id": "10-zeros",
    "grade": 10,
    "title": "Polynomial zeros",
    "category": "Algebra 2",
    "color": "blue",
    "minutes": 10,
    "description": "Connect factors to the places where a function equals zero.",
    "idea": "A zero is an input that makes a polynomial's output zero. If x - r is a factor, then r is a zero.",
    "rules": [
      "Look at each factor in a factored polynomial.",
      "Set each factor equal to zero.",
      "Check the requested zero in the original function."
    ],
    "mistake": "The factor x + 2 gives the zero -2, not 2.",
    "visual": "parabola",
    "standard": "Introductory practice"
  },
  {
    "id": "10-rational",
    "grade": 10,
    "title": "Rational expressions",
    "category": "Algebra 2",
    "color": "peach",
    "minutes": 10,
    "description": "Simplify algebraic fractions while preserving restrictions.",
    "idea": "A rational expression is a quotient of polynomials. Values that make the original denominator zero must stay excluded.",
    "rules": [
      "Identify excluded values from the original denominator.",
      "Factor the numerator and denominator.",
      "Cancel only common factors and keep the original restrictions."
    ],
    "mistake": "Cancel factors, not separate terms; a canceled denominator factor still creates an excluded value.",
    "visual": "rational",
    "standard": "Introductory practice"
  },
  {
    "id": "10-radicals",
    "grade": 10,
    "title": "Radical equations",
    "category": "Algebra 2",
    "color": "yellow",
    "minutes": 10,
    "description": "Solve equations that contain a root and check the result.",
    "idea": "Raising both sides to a power can help remove a radical. That step can also introduce answers that fail in the original equation.",
    "rules": [
      "Isolate the radical before applying a power.",
      "Solve the resulting equation.",
      "Substitute each candidate into the original equation."
    ],
    "mistake": "A candidate created by squaring is not a solution until it passes the original equation.",
    "visual": "squares",
    "standard": "Introductory practice"
  },
  {
    "id": "10-exponential",
    "grade": 10,
    "title": "Exponential equations",
    "category": "Algebra 2",
    "color": "lavender",
    "minutes": 10,
    "description": "Solve for an unknown exponent using matching bases.",
    "idea": "In an exponential equation, the unknown may appear in an exponent. Rewriting both sides with the same positive base other than 1 lets you compare exponents.",
    "rules": [
      "Rewrite both sides with a common base when possible.",
      "Set their exponents equal.",
      "Solve and check in the original equation."
    ],
    "mistake": "The exponent is not a coefficient: 2^x and 2x mean different things.",
    "visual": "powers",
    "standard": "Introductory practice"
  },
  {
    "id": "10-logarithms",
    "grade": 10,
    "title": "Logarithms",
    "category": "Algebra 2",
    "color": "mint",
    "minutes": 10,
    "description": "Find the exponent needed to produce a number.",
    "idea": "A logarithm answers an exponent question. The equation log_b(a) = c means b^c = a.",
    "rules": [
      "Use a positive argument and a positive base other than 1.",
      "Rewrite the logarithm as an exponential statement.",
      "Find the exponent and verify the result."
    ],
    "mistake": "log₂(8) is the exponent 3, not 8 divided by 2.",
    "visual": "log",
    "standard": "Introductory practice"
  },
  {
    "id": "10-nonlinear-systems",
    "grade": 10,
    "title": "Nonlinear systems",
    "category": "Algebra 2",
    "color": "blue",
    "minutes": 10,
    "description": "Find shared points of a line and a curved graph.",
    "idea": "A system solution must satisfy every equation at once. A line and a parabola can share zero, one or two points.",
    "rules": [
      "Substitute one equation into the other.",
      "Solve for every possible intersection input.",
      "Find the matching outputs and check both equations."
    ],
    "mistake": "A nonlinear system can have more than one intersection; stopping after one may lose a solution.",
    "visual": "parabola",
    "standard": "Introductory practice"
  },
  {
    "id": "11-coordinates",
    "grade": 11,
    "title": "Midpoint and distance",
    "category": "Geometry",
    "color": "mint",
    "minutes": 10,
    "description": "Measure and locate segments on the coordinate plane.",
    "idea": "A midpoint is halfway between two endpoints in both coordinates. The distance between points comes from the horizontal and vertical changes.",
    "rules": [
      "Label the coordinates of both endpoints.",
      "Average matching coordinates to find a midpoint.",
      "Use the Pythagorean theorem for the straight-line distance."
    ],
    "mistake": "Averaging only one coordinate does not give the full midpoint.",
    "visual": "coordinate",
    "standard": "Introductory practice"
  },
  {
    "id": "11-angles",
    "grade": 11,
    "title": "Angle relationships",
    "category": "Geometry",
    "color": "blue",
    "minutes": 10,
    "description": "Use angle facts to find missing measures.",
    "idea": "Complementary angles total 90°, while supplementary angles total 180°. Vertical angles formed by intersecting lines have equal measures.",
    "rules": [
      "Identify the relationship given in the problem.",
      "Write the matching sum or equality.",
      "Solve and check that the angle measure is reasonable."
    ],
    "mistake": "Complementary and supplementary angles use different totals.",
    "visual": "angles",
    "standard": "Introductory practice"
  },
  {
    "id": "11-parallel",
    "grade": 11,
    "title": "Parallel lines and transversals",
    "category": "Geometry",
    "color": "peach",
    "minutes": 10,
    "description": "Recognize equal and supplementary angles when a line crosses parallel lines.",
    "idea": "A transversal creates repeating angle relationships when it crosses parallel lines. Corresponding and alternate interior angles are equal in this situation.",
    "rules": [
      "Confirm that the two lines are parallel.",
      "Identify the positions of the angles.",
      "Use equality or a 180° sum according to their relationship."
    ],
    "mistake": "Do not assume corresponding angles are equal unless the lines are parallel or you are using their equality to prove parallelism.",
    "visual": "parallel",
    "standard": "Introductory practice"
  },
  {
    "id": "11-triangle-angles",
    "grade": 11,
    "title": "Triangle angle relationships",
    "category": "Geometry",
    "color": "yellow",
    "minutes": 10,
    "description": "Find missing interior and exterior triangle angles.",
    "idea": "The three interior angles of a triangle total 180°. An exterior angle equals the sum of the two nonadjacent interior angles.",
    "rules": [
      "Identify which angles are interior or exterior.",
      "Write the appropriate angle-sum equation.",
      "Solve and check the total."
    ],
    "mistake": "A sketch is not necessarily drawn to scale; use the given measures and relationships.",
    "visual": "angles",
    "standard": "Introductory practice"
  },
  {
    "id": "11-congruence",
    "grade": 11,
    "title": "Triangle congruence",
    "category": "Geometry",
    "color": "lavender",
    "minutes": 10,
    "description": "Match corresponding parts of triangles with the same size and shape.",
    "idea": "Congruent triangles have equal corresponding sides and angles. A congruence statement's vertex order tells you which parts correspond.",
    "rules": [
      "Match vertices in the stated order.",
      "Use an established congruence criterion when proving congruence.",
      "Match corresponding sides or angles to find a missing measure."
    ],
    "mistake": "A similar-looking drawing is not proof of congruence; AAA establishes similarity but not necessarily congruence.",
    "visual": "similar",
    "standard": "Introductory practice"
  },
  {
    "id": "11-transformations",
    "grade": 11,
    "title": "Rigid transformations",
    "category": "Geometry",
    "color": "mint",
    "minutes": 10,
    "description": "Move or reflect a figure while preserving its size and shape.",
    "idea": "Translations, rotations and reflections preserve lengths and angle measures. These rigid motions can show that two figures are congruent.",
    "rules": [
      "Identify the transformation and its reference point or line.",
      "Apply the same rule to every vertex.",
      "Check that distances and angle measures are preserved."
    ],
    "mistake": "Reflecting across the y-axis changes x, while reflecting across the x-axis changes y.",
    "visual": "coordinate",
    "standard": "Introductory practice"
  },
  {
    "id": "11-similarity",
    "grade": 11,
    "title": "Similarity and dilation",
    "category": "Geometry",
    "color": "blue",
    "minutes": 10,
    "description": "Use a scale factor to compare figures with the same shape.",
    "idea": "Similar figures have equal corresponding angles and proportional corresponding side lengths. A dilation changes lengths by one scale factor.",
    "rules": [
      "Identify corresponding sides.",
      "Find or use the scale factor between the figures.",
      "Multiply lengths by that factor and check the ratio."
    ],
    "mistake": "A length scale factor k changes area by k² and volume by k³, not by k.",
    "visual": "similar",
    "standard": "Introductory practice"
  },
  {
    "id": "11-pythagorean",
    "grade": 11,
    "title": "Pythagorean theorem",
    "category": "Geometry",
    "color": "peach",
    "minutes": 10,
    "description": "Find a missing side in a right triangle.",
    "idea": "In a right triangle, the squares of the leg lengths add to the square of the hypotenuse. The hypotenuse is opposite the right angle and is the longest side.",
    "rules": [
      "Confirm that the triangle has a right angle.",
      "Label the hypotenuse c and use a² + b² = c².",
      "Solve for the missing length and use a positive value."
    ],
    "mistake": "The theorem applies to right triangles, and c must label the hypotenuse.",
    "visual": "triangle",
    "standard": "Introductory practice"
  },
  {
    "id": "11-trigonometry",
    "grade": 11,
    "title": "Right-triangle trigonometry",
    "category": "Geometry",
    "color": "yellow",
    "minutes": 10,
    "description": "Relate an acute angle to ratios of right-triangle sides.",
    "idea": "Sine, cosine and tangent compare side lengths relative to a selected acute angle. Similar right triangles with that angle have the same side ratios.",
    "rules": [
      "Mark the selected angle and label opposite, adjacent and hypotenuse.",
      "Choose sine, cosine or tangent to match the needed sides.",
      "Form the ratio or solve the resulting equation."
    ],
    "mistake": "Opposite and adjacent depend on the selected angle; the hypotenuse stays opposite the right angle.",
    "visual": "trig",
    "standard": "Introductory practice"
  },
  {
    "id": "11-quadrilaterals",
    "grade": 11,
    "title": "Quadrilaterals and polygons",
    "category": "Geometry",
    "color": "lavender",
    "minutes": 10,
    "description": "Use side and angle properties to reason about polygons.",
    "idea": "Different quadrilaterals have different defining properties. In a parallelogram, opposite sides and opposite angles are equal, while adjacent angles are supplementary.",
    "rules": [
      "Identify the polygon and the properties you may use.",
      "Connect the known measure to the requested measure.",
      "Write an equation and check it against the shape's properties."
    ],
    "mistake": "In a parallelogram, opposite angles are equal but adjacent angles usually are not.",
    "visual": "angles",
    "standard": "Introductory practice"
  },
  {
    "id": "11-circles",
    "grade": 11,
    "title": "Circles and their equations",
    "category": "Geometry",
    "color": "mint",
    "minutes": 10,
    "description": "Connect a circle's center and radius to its coordinate equation.",
    "idea": "Every point on a circle is the same distance from its center. The equation (x - h)² + (y - k)² = r² represents a circle with center (h, k) and radius r.",
    "rules": [
      "Identify the center from the squared coordinate differences.",
      "Read the right side as the radius squared.",
      "Take the positive square root to find the radius."
    ],
    "mistake": "In a circle equation, the right side is r², not r; (y + 1)² means a center y-coordinate of -1.",
    "visual": "circle",
    "standard": "Introductory practice"
  },
  {
    "id": "11-measurement",
    "grade": 11,
    "title": "Area, surface area and volume",
    "category": "Geometry",
    "color": "blue",
    "minutes": 10,
    "description": "Choose the correct measure and formula for a geometric object.",
    "idea": "Area measures a flat region, surface area covers a solid, and volume fills a solid. A cone's volume is one third of a cylinder with the same base and height.",
    "rules": [
      "Identify whether the task asks for area, surface area or volume.",
      "Select the correct formula and substitute consistent units.",
      "Compute and label square or cubic units as appropriate."
    ],
    "mistake": "A cone's volume needs the factor 1/3; its perpendicular height is not its slant height.",
    "visual": "volume",
    "standard": "Introductory practice"
  }
];
